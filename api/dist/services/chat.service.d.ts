import { SearchService } from './search.service';
import { PromptService } from './prompt.service';
import { PrismaService } from './prisma.service';
import { LLMProvider } from "../providers/ai/LLM/llm.provider";
import { JwtPayload } from "../types/user.type";
export interface ChatResponse {
    answer: string;
    sources: {
        category: string;
        source: string;
        similarity: number;
    }[];
    avgSimilarity: number;
    chunksUsed: number;
}
export declare class ChatService {
    private search;
    private prompt;
    private aiProvider;
    private prismaService;
    private readonly logger;
    constructor(search: SearchService, prompt: PromptService, aiProvider: LLMProvider, prismaService: PrismaService);
    ask(question: string, user?: JwtPayload | null): Promise<ChatResponse>;
    getHistory(limit?: number, user?: JwtPayload | null): Promise<{
        answer: string;
        id: number;
        question: string;
        similarity: number | null;
        createdAt: Date;
    }[]>;
    private saveLog;
}
