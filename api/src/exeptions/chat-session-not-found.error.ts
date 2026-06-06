import { DomainError } from './domain.error';

export class ChatSessionNotFoundError extends DomainError {
  readonly statusCode = 404;

  constructor(message = 'Sessão de chat não encontrada.') {
    super(message);
  }
}
