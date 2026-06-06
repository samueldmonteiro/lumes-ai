import { DomainError } from './domain.error';
export declare class UserNotFoundError extends DomainError {
    readonly statusCode = 404;
    constructor();
}
