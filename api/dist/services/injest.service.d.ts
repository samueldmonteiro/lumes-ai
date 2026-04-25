import { ChunkerService } from './chunker.service';
import { OllamaService } from './ollama.service';
export interface IngestResult {
    ok: boolean;
    source: string;
    category: string;
    chunksProcessed: number;
    chunksSaved: number;
}
export declare class IngestService {
    private readonly chunker;
    private readonly ollama;
    private readonly logger;
    constructor(chunker: ChunkerService, ollama: OllamaService);
    ingestText(raw: string, source: string, category: string): Promise<IngestResult>;
    private processText;
}
