import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { EmbeddingProvider } from '@/ai/embedding-providers/embedding-provider';

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

    // O pgvector NÃO aceita o vetor via bind parameter ($1::vector) —
    // o driver Prisma envia como text e o cast falha silenciosamente.
    // Solução: injetar o literal do vetor diretamente na query com Prisma.raw()
    const vectorLiteral = Prisma.raw(`'${vector}'::vector`);
    const minSim = Prisma.raw(String(this.minSimilarity));
    const limitRaw = Prisma.raw(String(limit));

    // DEBUG: mostra as similaridades brutas antes de aplicar o filtro
    const debugRows = await prisma.$queryRaw<{ id: number; source: string; similarity: number }[]>(
      Prisma.sql`
        SELECT id, source, 1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM knowledge_chunks
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT 5
      `,
    );
    this.logger.debug(
      `📊 Top-5 similaridades brutas para "${question}":\n` +
      debugRows.map(r => `  [${r.id}] ${r.source} → ${Number(r.similarity).toFixed(4)}`).join('\n'),
    );

    // 2. Busca no PostgreSQL os chunks mais próximos pelo vetor
    //    <=> é o operador de distância cosine do pgvector
    //    1 - distância = similaridade (quanto maior, mais parecido)
    const rows = await prisma.$queryRaw<SearchResult[]>(
      Prisma.sql`
        SELECT
          id,
          content,
          category,
          source,
          1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM knowledge_chunks
        WHERE 1 - (embedding <=> ${vectorLiteral}) > ${minSim}
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT ${limitRaw}
      `,
    );

    this.logger.log(`🔍 "${question}" → ${rows.length} chunks encontrados (threshold: ${this.minSimilarity})`);

    return rows;
  }
}