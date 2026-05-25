import { DomainError } from './domain.error';

export class InvalidCredentialsError extends DomainError {
  readonly statusCode = 401;

  constructor() {
    super('E-mail ou senha inválidos.');
  }
}
