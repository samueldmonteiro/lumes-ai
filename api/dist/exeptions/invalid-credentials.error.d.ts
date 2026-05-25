import { DomainError } from './domain.error';
export declare class InvalidCredentialsError extends DomainError {
    readonly statusCode = 401;
    constructor();
}
