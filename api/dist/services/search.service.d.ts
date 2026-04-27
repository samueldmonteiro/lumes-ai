import 'dotenv/config';
import { OllamaService } from './ollama.service';
export interface SearchResult {
    id: number;
    content: string;
    category: string;
    source: string;
    similarity: number;
}
export declare class SearchService {
    private ollama;
    private readonly logger;
    private topK;
    private minSimilarity;
    constructor(ollama: OllamaService);
    findSimilarChunks(question: string, topK?: number): Promise<SearchResult[]>;
}
