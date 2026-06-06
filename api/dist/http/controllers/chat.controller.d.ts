import { ChatService } from "../../services/chat.service";
import { BaseController } from './base.controller';
import { ChatRequestDto } from '../dtos/chat.dto';
import { type JwtPayload } from "../../types/user.type";
export declare class ChatController extends BaseController {
    private readonly chatService;
    constructor(chatService: ChatService);
    ask(body: ChatRequestDto, user?: JwtPayload): Promise<import("./base.controller").ApiResponse<import("@/services/chat.service").ChatResponse>>;
    getHistory(limit?: number, user?: JwtPayload): Promise<import("./base.controller").ApiResponse<import("../../repositories/prisma/prisma-chat-log.repository").ChatLogEntry[]>>;
    getSessions(user: JwtPayload, limit?: number): Promise<import("./base.controller").ApiResponse<{
        id: string;
        title: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>>;
    getSessionDetails(id: string, user: JwtPayload): Promise<import("./base.controller").ApiResponse<{
        chatLogs: {
            id: number;
            userId: number | null;
            createdAt: Date;
            question: string;
            answer: string;
            sources: import("@prisma/client/runtime/client").JsonValue;
            similarity: number | null;
            sessionId: string | null;
        }[];
    } & {
        id: string;
        title: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    deleteSession(id: string, user: JwtPayload): Promise<import("./base.controller").ApiResponse<null>>;
}
