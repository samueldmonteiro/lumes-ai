import { Injectable, Logger } from '@nestjs/common';
import { ChunkerService } from './chunker.service';
import { extractFromPDF, extractFromText, extractFromJSON } from '@/utils/extractors';
import { PrismaKnowledgeChunkRepository } from '@/repositories/prisma/prisma-knowledge-chunk.repository';
import { EmbeddingProvider } from '@/providers/ai/embedding/embedding.provider';

export interface IngestResult {
  ok: boolean;
  source: string;
  chunksProcessed: number;
  chunksSaved: number;
}

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);

  constructor(
    private readonly chunker: ChunkerService,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly knowledgeChunkRepo: PrismaKnowledgeChunkRepository,
  ) { }

  async ingestText(raw: string, source: string): Promise<IngestResult> {
    this.logger.log(`📝 Ingerindo texto: ${source}`);
    const text = extractFromText(raw);
    return this.processText(text, source);
  }

  async ingestPDF(buffer: Buffer, source: string): Promise<IngestResult> {
    this.logger.log(`📄 Ingerindo PDF: ${source}`);
    const text = await extractFromPDF(buffer);
    return this.processText(text, source);
  }

  async ingestJSON(
    data: Record<string, unknown>,
    source: string,
  ): Promise<IngestResult> {
    this.logger.log(`🗂️  Ingerindo JSON: ${source}`);
    const text = extractFromJSON(data);
    return this.processText(text, source);
  }

  private async processText(
    text: string,
    source: string,
    chunkSize?: number,
    overlap?: number,
  ): Promise<IngestResult> {
    const chunks = this.chunker.split(text, chunkSize, overlap);
    console.log(`${chunks.length} chunks gerados`);

    // Previne dados duplicados no banco caso o mesmo arquivo seja reprocessado
    await this.knowledgeChunkRepo.deleteManyBySource(source);

    let saved = 0;

    for (const chunk of chunks) {
      // O embedding é gerado a partir do conteúdo puro do chunk.
      // IMPORTANTE: NÃO adicionar prefixos ("Documento:", "Categoria:") aqui,
      // pois a busca vetorial embeda apenas a pergunta do usuário.
      // Assimetria entre o texto da ingestão e o da busca derruba a similaridade cosseno.
      const embedding = await this.embeddingProvider.generateEmbedding(
        chunk.content,
      );

      const embeddingVector =
        this.embeddingProvider.formatVectorForPg(embedding);

      await this.knowledgeChunkRepo.insertChunk({
        content: chunk.content,
        embeddingVector,
        source,
        metadata: { chunkIndex: chunk.index },
      });

      saved++;

      // Delay para não sobrecarregar o Ollama
      await this.delay(80);
    }

    return {
      ok: true,
      source,
      chunksProcessed: chunks.length,
      chunksSaved: saved,
    };
  }

  private delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}