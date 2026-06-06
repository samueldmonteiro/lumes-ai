import { DomainError } from './domain.error';
export declare class ChatSessionNotFoundError extends DomainError {
    readonly statusCode = 404;
    constructor(message?: string);
}
