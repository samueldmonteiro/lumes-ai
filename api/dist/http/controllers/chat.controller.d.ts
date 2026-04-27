import { ChatService } from "../../services/chat.service";
import { BaseController } from './base.controller';
import { ChatRequestDto } from '../dtos/chat.dto';
export declare class ChatController extends BaseController {
    private readonly chatService;
    constructor(chatService: ChatService);
    ask(body: ChatRequestDto): Promise<import("./base.controller").ApiResponse<import("@/services/chat.service").ChatResponse>>;
    getHistory(limit?: number): Promise<import("./base.controller").ApiResponse<{
        answer: string;
        id: number;
        question: string;
        similarity: number | null;
        createdAt: Date;
    }[]>>;
}
