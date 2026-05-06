export declare abstract class EmbeddingProvider {
    abstract generateEmbedding(text: string): Promise<number[]>;
    abstract formatVectorForPg(embedding: number[]): string;
}
