import { DomainError } from './domain.error';
export declare class ForbiddenError extends DomainError {
    readonly statusCode = 403;
    constructor(message?: string);
}
