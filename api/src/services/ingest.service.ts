import { Injectable, Logger } from '@nestjs/common';
import { ChunkerService } from './chunker.service';
import { extractFromText } from '@/lib/extractors';
import { OllamaService } from './ollama.service';
import { prisma } from '@/lib/prisma';

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
    private readonly ollama: OllamaService,

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
        // Enriquecer o chunk com contexto (metadados) melhora drasticamente a busca vetorial no RAG
        const contextAwareText = `Documento: ${source}\nCategoria: ${category}\n\n${chunk.content}`;

        // Gera o vetor do chunk enriquecido via Ollama (nomic-embed-text)
        const embedding = await this.ollama.generateEmbedding(contextAwareText);

        // Salva no PostgreSQL usando SQL puro ($executeRaw) pois o Prisma não suporta 
        // nativamente o tipo 'vector' em operações de CRUD (é marcado como Unsupported).
        const vectorStr = this.ollama.formatVectorForPg(embedding);

        await prisma.$executeRaw`
          INSERT INTO "knowledge_chunks" ("content", "embedding", "category", "source", "metadata", "updatedAt")
          VALUES (
            ${chunk.content}, 
            ${vectorStr}::vector, 
            ${category}, 
            ${source}, 
            ${{ chunkIndex: chunk.index }}::jsonb,
            NOW()
          )
        `;

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