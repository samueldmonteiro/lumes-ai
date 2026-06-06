import 'dotenv/config';
import { PrismaKnowledgeChunkRepository } from "../repositories/prisma/prisma-knowledge-chunk.repository";
import { EmbeddingProvider } from "../providers/ai/embedding/embedding.provider";
export interface SearchResult {
    id: number;
    content: string;
    category: string;
    source: string;
    similarity: number;
}
export declare class SearchService {
    private embeddingProvider;
    private knowledgeChunkRepo;
    private readonly logger;
    private topK;
    private minSimilarity;
    constructor(embeddingProvider: EmbeddingProvider, knowledgeChunkRepo: PrismaKnowledgeChunkRepository);
    findSimilarChunks(question: string, topK?: number): Promise<SearchResult[]>;
}
