import { PrismaService } from "../../services/prisma.service";
export interface SearchResult {
    id: number;
    content: string;
    category: string;
    source: string;
    similarity: number;
}
export declare class PrismaKnowledgeChunkRepository {
    private readonly prisma;
    private readonly schema;
    constructor(prisma: PrismaService);
    private tbl;
    deleteManyBySource(source: string): Promise<number>;
    insertChunk(data: {
        content: string;
        embeddingVector: string;
        source: string;
        metadata: object;
    }): Promise<void>;
    findSimilarChunks(embeddingVector: string, topK: number, minSimilarity: number): Promise<SearchResult[]>;
    getTopKSimilarities(embeddingVector: string, k: number): Promise<{
        id: number;
        source: string;
        similarity: number;
    }[]>;
}
