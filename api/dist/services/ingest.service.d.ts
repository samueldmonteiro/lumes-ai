import { ChunkerService } from './chunker.service';
import { PrismaService } from './prisma.service';
import { EmbeddingProvider } from "../providers/ai/embedding/embedding.provider";
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
    private readonly prismaService;
    private readonly logger;
    constructor(chunker: ChunkerService, embeddingProvider: EmbeddingProvider, prismaService: PrismaService);
    ingestText(raw: string, source: string, category: string): Promise<IngestResult>;
    private processText;
    private delay;
}
