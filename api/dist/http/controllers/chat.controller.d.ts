import { ChatService } from "../../services/chat.service";
import { BaseController } from './base.controller';
import { ChatRequestDto } from '../dtos/chat.dto';
import { type JwtPayload } from "../../types/user.type";
export declare class ChatController extends BaseController {
    private readonly chatService;
    constructor(chatService: ChatService);
    ask(body: ChatRequestDto, user?: JwtPayload): Promise<import("./base.controller").ApiResponse<import("@/services/chat.service").ChatResponse>>;
    getHistory(limit?: number, user?: JwtPayload): Promise<import("./base.controller").ApiResponse<{
        answer: string;
        id: number;
        question: string;
        similarity: number | null;
        createdAt: Date;
    }[]>>;
}
