import { EmbeddingProvider } from './embedding-provider';
export declare class OllamaEmbeddingProvider implements EmbeddingProvider {
    private baseUrl;
    private embedModel;
    constructor();
    generateEmbedding(text: string): Promise<number[]>;
    formatVectorForPg(embedding: number[]): string;
}
