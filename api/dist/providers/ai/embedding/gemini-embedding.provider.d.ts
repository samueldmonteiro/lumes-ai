import { EmbeddingProvider } from './embedding.provider';
export declare class GeminiEmbeddingProvider implements EmbeddingProvider {
    private ai;
    private embedModel;
    constructor();
    generateEmbedding(text: string): Promise<number[]>;
    formatVectorForPg(embedding: number[]): string;
}
