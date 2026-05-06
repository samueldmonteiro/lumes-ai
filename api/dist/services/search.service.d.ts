import 'dotenv/config';
import { EmbeddingProvider } from "../ai/embedding-providers/embedding-provider";
export interface SearchResult {
    id: number;
    content: string;
    category: string;
    source: string;
    similarity: number;
}
export declare class SearchService {
    private embeddingProvider;
    private readonly logger;
    private topK;
    private minSimilarity;
    constructor(embeddingProvider: EmbeddingProvider);
    findSimilarChunks(question: string, topK?: number): Promise<SearchResult[]>;
}
