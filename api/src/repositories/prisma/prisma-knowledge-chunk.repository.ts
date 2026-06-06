import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/services/prisma.service';

export interface SearchResult {
  id: number;
  content: string;
  source: string;
  similarity: number;
}

@Injectable()
export class PrismaKnowledgeChunkRepository {
  private readonly schema: string;

  constructor(private readonly prisma: PrismaService) {
    this.schema = prisma.schema;
  }

  private tbl(name: string): string {
    return `"${this.schema}"."${name}"`;
  }

  async deleteManyBySource(source: string): Promise<number> {
    const result = await this.prisma.knowledgeChunk.deleteMany({
      where: { source },
    });
    return result.count;
  }

  async insertChunk(data: {
    content: string;
    embeddingVector: string;
    source: string;
    metadata: object;
  }) {
    const vectorLiteral = Prisma.raw(`'${data.embeddingVector}'::vector`);
    const metadataLiteral = Prisma.raw(
      `'${JSON.stringify(data.metadata)}'::jsonb`,
    );
    const table = Prisma.raw(this.tbl('knowledge_chunks'));

    await this.prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO ${table} ("content", "embedding", "source", "metadata", "updatedAt")
        VALUES (
          ${data.content},
          ${vectorLiteral},
          ${data.source},
          ${metadataLiteral},
          NOW()
        )
      `,
    );
  }

  async findSimilarChunks(
    embeddingVector: string,
    topK: number,
    minSimilarity: number,
  ): Promise<SearchResult[]> {
    const vectorLiteral = Prisma.raw(`'${embeddingVector}'::vector`);
    const minSim = Prisma.raw(String(minSimilarity));
    const limitRaw = Prisma.raw(String(topK));
    const table = Prisma.raw(this.tbl('knowledge_chunks'));

    return this.prisma.$queryRaw<SearchResult[]>(
      Prisma.sql`
        SELECT
          id,
          content,
          source,
          1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM ${table}
        WHERE 1 - (embedding <=> ${vectorLiteral}) > ${minSim}
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT ${limitRaw}
      `,
    );
  }

  async getTopKSimilarities(
    embeddingVector: string,
    k: number,
  ): Promise<{ id: number; source: string; similarity: number }[]> {
    const vectorLiteral = Prisma.raw(`'${embeddingVector}'::vector`);
    const table = Prisma.raw(this.tbl('knowledge_chunks'));

    return this.prisma.$queryRaw<
      { id: number; source: string; similarity: number }[]
    >(
      Prisma.sql`
        SELECT id, source, 1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM ${table}
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT ${Prisma.raw(String(k))}
      `,
    );
  }
}
