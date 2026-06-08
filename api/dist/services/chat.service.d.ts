import { SearchService } from './search.service';
import { PromptService, ChatMessage } from './prompt.service';
import { PrismaChatLogRepository } from "../repositories/prisma/prisma-chat-log.repository";
import { PrismaChatSessionRepository } from "../repositories/prisma/prisma-chat-session.repository";
import { LLMProvider } from "../providers/ai/LLM/llm.provider";
import { JwtPayload } from "../types/user.type";
export interface ChatResponse {
    answer: string;
    sources: {
        source: string;
        similarity: number;
    }[];
    avgSimilarity: number;
    chunksUsed: number;
    sessionId?: string;
}
export declare class ChatService {
    private search;
    private prompt;
    private aiProvider;
    private chatLogRepo;
    private chatSessionRepo;
    constructor(search: SearchService, prompt: PromptService, aiProvider: LLMProvider, chatLogRepo: PrismaChatLogRepository, chatSessionRepo: PrismaChatSessionRepository);
    ask(question: string, user?: JwtPayload | null, sessionId?: string, payloadHistory?: ChatMessage[]): Promise<ChatResponse>;
    getHistory(limit: number | undefined, user: JwtPayload): Promise<import("@/repositories/prisma/prisma-chat-log.repository").ChatLogEntry[]>;
    getSessions(userId: number, limit?: number): Promise<{
        title: string;
        createdAt: Date;
        id: string;
        userId: number;
        updatedAt: Date;
    }[]>;
    getSessionDetails(sessionId: string, userId: number): Promise<{
        chatLogs: {
            question: string;
            answer: string;
            sources: import("@prisma/client/runtime/client").JsonValue;
            similarity: number | null;
            createdAt: Date;
            id: number;
            userId: number | null;
            sessionId: string | null;
        }[];
    } & {
        title: string;
        createdAt: Date;
        id: string;
        userId: number;
        updatedAt: Date;
    }>;
    deleteSession(sessionId: string, userId: number): Promise<void>;
    private saveLog;
}
