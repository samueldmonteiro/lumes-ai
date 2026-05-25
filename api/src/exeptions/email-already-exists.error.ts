import { DomainError } from './domain.error';

export class EmailAlreadyExistsError extends DomainError {
  readonly statusCode = 409;

  constructor() {
    super('Este e-mail já está em uso.');
  }
}
