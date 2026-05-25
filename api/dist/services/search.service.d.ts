import 'dotenv/config';
import { PrismaService } from './prisma.service';
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
    private prismaService;
    private readonly logger;
    private topK;
    private minSimilarity;
    constructor(embeddingProvider: EmbeddingProvider, prismaService: PrismaService);
    findSimilarChunks(question: string, topK?: number): Promise<SearchResult[]>;
}
