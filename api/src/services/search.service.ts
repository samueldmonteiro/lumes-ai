import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { prisma } from '@/lib/prisma';

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
    private ollama: OllamaService,
  ) {
    this.topK          = parseInt(process.env.SEARCH_TOP_K || '4');
    this.minSimilarity = parseFloat(process.env.SEARCH_MIN_SIMILARITY || '0.5');
  }

  // Recebe a pergunta, gera o vetor e busca os chunks mais similares
  async findSimilarChunks(
    question: string,
    topK?: number,
  ): Promise<SearchResult[]> {
    // 1. Vetoriza a pergunta com o mesmo modelo usado na ingestão
    const embedding = await this.ollama.generateEmbedding(question);
    const vector    = this.ollama.formatVectorForPg(embedding);

    const limit = topK ?? this.topK;

    // 2. Busca no PostgreSQL os chunks mais próximos pelo vetor
    //    <=> é o operador de distância cosine do pgvector
    //    1 - distância = similaridade (quanto maior, mais parecido)
    const rows = await prisma.$queryRaw<SearchResult[]>`
      SELECT
         id,
         content,
         category,
         source,
         1 - (embedding <=> ${vector}::vector) AS similarity
       FROM knowledge_chunks
       WHERE 1 - (embedding <=> ${vector}::vector) > ${this.minSimilarity}
       ORDER BY embedding <=> ${vector}::vector
       LIMIT ${limit}
    `;

    this.logger.log(`🔍 "${question}" → ${rows.length} chunks encontrados`);

    return rows;
  }
}