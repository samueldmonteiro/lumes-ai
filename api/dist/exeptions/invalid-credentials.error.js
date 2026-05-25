"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = void 0;
const domain_error_1 = require("./domain.error");
class InvalidCredentialsError extends domain_error_1.DomainError {
    statusCode = 401;
    constructor() {
        super('E-mail ou senha inválidos.');
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
//# sourceMappingURL=invalid-credentials.error.js.map