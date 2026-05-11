import { ChunkerService } from './chunker.service';
import { EmbeddingProvider } from "../ai/embedding-providers/embedding-provider";
export interface IngestResult {
    ok: boolean;
    source: string;
    category: string;
    chunksProcessed: number;
    chunksSaved: number;
}
export declare class IngestService {
    private readonly chunker;
    private readonly embeddingProvider;
    private readonly logger;
    constructor(chunker: ChunkerService, embeddingProvider: EmbeddingProvider);
    ingestText(raw: string, source: string, category: string): Promise<IngestResult>;
    private processText;
    private delay;
}
