export declare class ChatMessageDto {
    role: 'user' | 'model';
    content: string;
}
export declare class ChatRequestDto {
    question: string;
    sessionId?: string;
    history?: ChatMessageDto[];
}
export declare class ChatResponseDto {
    answer: string;
    sources: {
        source: string;
        similarity: number;
    }[];
    avgSimilarity: number;
    chunksUsed: number;
    sessionId?: string;
}
export declare class AskResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: ChatResponseDto;
}
export declare class ChatLogEntryDto {
    id: number;
    question: string;
    answer: string;
    similarity: number | null;
    createdAt: Date;
}
export declare class ChatHistoryResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: ChatLogEntryDto[];
}
export declare class ChatSessionDto {
    id: string;
    title: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ChatSessionsResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: ChatSessionDto[];
}
export declare class ChatLogDetailDto {
    id: number;
    question: string;
    answer: string;
    sources: any;
    similarity: number | null;
    createdAt: Date;
    userId: number;
    sessionId: string | null;
}
export declare class ChatSessionDetailsDto {
    id: string;
    title: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    chatLogs: ChatLogDetailDto[];
}
export declare class ChatSessionDetailsResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: ChatSessionDetailsDto;
}
export declare class DeleteSessionResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: any;
}
export declare class BadRequestResponseDto {
    code: number;
    ok: boolean;
    message: string;
}
export declare class UnauthorizedResponseDto {
    code: number;
    ok: boolean;
    message: string;
}
export declare class NotFoundResponseDto {
    code: number;
    ok: boolean;
    message: string;
}
