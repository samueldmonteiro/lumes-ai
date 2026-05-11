import { Injectable, Logger } from '@nestjs/common';
import { ChunkerService } from './chunker.service';
import { extractFromText } from '@/lib/extractors';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { EmbeddingProvider } from '@/ai/embedding-providers/embedding-provider';

export interface IngestResult {
  ok: boolean;
  source: string;
  category: string;
  chunksProcessed: number;
  chunksSaved: number;
}

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);

  constructor(
    private readonly chunker: ChunkerService,
    private readonly embeddingProvider: EmbeddingProvider,

  ) { }

  async ingestText(
    raw: string,
    source: string,
    category: string,
  ): Promise<IngestResult> {
    this.logger.log(`📝 Ingerindo texto: ${source}`);
    const text = extractFromText(raw);
    console.log('texto extraido', text);
    const processed = await this.processText(text, source, category);
    console.log('Processado', processed);
    return processed;
  }

  private async processText(
    text: string,
    source: string,
    category: string,
    chunkSize?: number,
    overlap?: number,
  ): Promise<IngestResult> {
    const chunks = this.chunker.split(text, chunkSize, overlap);
    this.logger.log(`   ${chunks.length} chunks gerados`);

    // Previne dados duplicados no banco caso o mesmo arquivo seja reprocessado
    try {
      const deleted = await prisma.knowledgeChunk.deleteMany({
        where: { source },
      });
      if (deleted.count > 0) {
        this.logger.log(`   🗑️ Limpou ${deleted.count} chunks antigos para a fonte: ${source}`);
      }
    } catch (error: any) {
      this.logger.warn(`   Aviso ao tentar limpar chunks antigos: ${error.message}`);
    }

    let saved = 0;

    console.log('Chunks gerados e prontos para embedding');

    for (const chunk of chunks) {
      try {
        // O embedding é gerado a partir do conteúdo puro do chunk.
        // IMPORTANTE: NÃO adicionar prefixos ("Documento:", "Categoria:") aqui,
        // pois a busca vetorial embeda apenas a pergunta do usuário.
        // Assimetria entre o texto da ingestão e o da busca derruba a similaridade cosseno.
        const embedding = await this.embeddingProvider.generateEmbedding(chunk.content);

        // Salva no PostgreSQL usando SQL puro pois o Prisma não suporta
        // nativamente o tipo 'vector' em operações de CRUD (é marcado como Unsupported).
        // IMPORTANTE: usar Prisma.raw() para o vetor — o pgvector não aceita
        // o cast ::vector via bind parameter ($1::vector), precisa ser literal na query.
        const vectorStr = this.embeddingProvider.formatVectorForPg(embedding);
        const vectorLiteral = Prisma.raw(`'${vectorStr}'::vector`);
        const metadataLiteral = Prisma.raw(`'${JSON.stringify({ chunkIndex: chunk.index })}'::jsonb`);

        await prisma.$executeRaw(
          Prisma.sql`
            INSERT INTO "knowledge_chunks" ("content", "embedding", "category", "source", "metadata", "updatedAt")
            VALUES (
              ${chunk.content},
              ${vectorLiteral},
              ${category},
              ${source},
              ${metadataLiteral},
              NOW()
            )
          `,
        );

        saved++;

        // Delay para não sobrecarregar o Ollama
        await this.delay(80);
      } catch (err: any) {
        this.logger.error(`Erro no chunk ${chunk.index}: ${err.message}`);
      }
    }

    this.logger.log(`   ✅ ${saved}/${chunks.length} chunks salvos`);

    return {
      ok: true,
      source,
      category,
      chunksProcessed: chunks.length,
      chunksSaved: saved,
    };
  }

  private delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }
}