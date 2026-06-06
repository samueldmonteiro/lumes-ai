import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaKnowledgeChunkRepository } from '@/repositories/prisma/prisma-knowledge-chunk.repository';
import { EmbeddingProvider } from '@/providers/ai/embedding/embedding.provider';

export interface SearchResult {
  id: number;
  content: string;
  category: string;
  source: string;
  similarity: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private topK: number;
  private minSimilarity: number;

  constructor(
    private embeddingProvider: EmbeddingProvider,
    private knowledgeChunkRepo: PrismaKnowledgeChunkRepository,
  ) {
    this.topK = parseInt(process.env.SEARCH_TOP_K || '4');
    this.minSimilarity = parseFloat(process.env.SEARCH_MIN_SIMILARITY || '0.5');
  }

  async findSimilarChunks(
    question: string,
    topK?: number,
  ): Promise<SearchResult[]> {
    // 1. Vetoriza a pergunta com o mesmo modelo usado na ingestão
    const embedding = await this.embeddingProvider.generateEmbedding(question);
    const vector = this.embeddingProvider.formatVectorForPg(embedding);

    const limit = topK ?? this.topK;

    // DEBUG: mostra as similaridades brutas antes de aplicar o filtro
    const debugRows = await this.knowledgeChunkRepo.getTopKSimilarities(
      vector,
      5,
    );
    this.logger.debug(
      `📊 Top-5 similaridades brutas para "${question}":\n` +
        debugRows
          .map(
            (r) =>
              `  [${r.id}] ${r.source} → ${Number(r.similarity).toFixed(4)}`,
          )
          .join('\n'),
    );

    // 2. Busca no PostgreSQL os chunks mais próximos pelo vetor
    const rows = await this.knowledgeChunkRepo.findSimilarChunks(
      vector,
      limit,
      this.minSimilarity,
    );

    this.logger.log(
      `🔍 "${question}" → ${rows.length} chunks encontrados (threshold: ${this.minSimilarity})`,
    );

    return rows;
  }
}
