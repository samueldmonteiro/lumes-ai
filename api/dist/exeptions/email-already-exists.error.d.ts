import { DomainError } from './domain.error';
export declare class EmailAlreadyExistsError extends DomainError {
    readonly statusCode = 409;
    constructor();
}
