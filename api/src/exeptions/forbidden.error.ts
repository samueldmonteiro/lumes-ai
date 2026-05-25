import { DomainError } from './domain.error';

export class ForbiddenError extends DomainError {
  readonly statusCode = 403;

  constructor(message = 'Acesso negado: permissões insuficientes.') {
    super(message);
  }
}
