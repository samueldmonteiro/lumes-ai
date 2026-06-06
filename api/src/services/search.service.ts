import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaKnowledgeChunkRepository } from '@/repositories/prisma/prisma-knowledge-chunk.repository';
import { EmbeddingProvider } from '@/providers/ai/embedding/embedding.provider';

export interface SearchResult {
  id: number;
  content: string;
  source: string;
  similarity: number;
}

@Injectable()
export class SearchService {
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

    // 2. Busca no PostgreSQL os chunks mais próximos pelo vetor
    const rows = await this.knowledgeChunkRepo.findSimilarChunks(
      vector,
      limit,
      this.minSimilarity,
    );

    return rows;
  }
}
