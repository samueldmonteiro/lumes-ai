import 'dotenv/config';
import { OnModuleInit } from '@nestjs/common';
export declare class OllamaService implements OnModuleInit {
    private readonly logger;
    private baseUrl;
    private embedModel;
    private llmModel;
    constructor();
    onModuleInit(): Promise<void>;
    generateEmbedding(text: string): Promise<number[]>;
    generateResponse(prompt: string): Promise<string>;
    formatVectorForPg(embedding: number[]): string;
}
