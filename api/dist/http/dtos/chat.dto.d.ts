export declare class ChatMessageDto {
    role: 'user' | 'model';
    content: string;
}
export declare class ChatRequestDto {
    question: string;
    sessionId?: string;
    history?: ChatMessageDto[];
}
