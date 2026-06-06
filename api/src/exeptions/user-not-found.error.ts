import { DomainError } from './domain.error';

export class UserNotFoundError extends DomainError {
  readonly statusCode = 404;

  constructor() {
    super('Usuário não encontrado.');
  }
}
