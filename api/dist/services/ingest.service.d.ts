import { ChunkerService } from './chunker.service';
import { PrismaKnowledgeChunkRepository } from "../repositories/prisma/prisma-knowledge-chunk.repository";
import { EmbeddingProvider } from "../providers/ai/embedding/embedding.provider";
export interface IngestResult {
    ok: boolean;
    source: string;
    chunksProcessed: number;
    chunksSaved: number;
}
export declare class IngestService {
    private readonly chunker;
    private readonly embeddingProvider;
    private readonly knowledgeChunkRepo;
    private readonly logger;
    constructor(chunker: ChunkerService, embeddingProvider: EmbeddingProvider, knowledgeChunkRepo: PrismaKnowledgeChunkRepository);
    ingestText(raw: string, source: string): Promise<IngestResult>;
    ingestPDF(buffer: Buffer, source: string): Promise<IngestResult>;
    ingestJSON(data: Record<string, unknown>, source: string): Promise<IngestResult>;
    private processText;
    private delay;
    listDocuments(): Promise<{
        id: string;
        source: string;
        type: string;
        content: string;
        chunks: number;
        createdAt: string;
        updatedAt: string;
    }[]>;
    getStats(): Promise<{
        totalDocs: number;
        totalChunks: number;
        uniqueSources: number;
        lastUpload: string | null;
        documentsByType: {
            text: number;
            json: number;
            pdf: number;
        };
    }>;
    deleteBySource(source: string): Promise<{
        source: string;
        deletedChunks: number;
    }>;
    private inferTypeFromSource;
}
