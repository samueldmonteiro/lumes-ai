import { SearchService } from './search.service';
import { PromptService } from './prompt.service';
import { AIProvider } from "../ai/providers/ai.provider";
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
    private readonly logger;
    constructor(search: SearchService, prompt: PromptService, aiProvider: AIProvider);
    ask(question: string): Promise<ChatResponse>;
    getHistory(limit?: number): Promise<{
        answer: string;
        id: number;
        question: string;
        similarity: number | null;
        createdAt: Date;
    }[]>;
    private saveLog;
}
