"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = void 0;
const domain_error_1 = require("./domain.error");
class UserNotFoundError extends domain_error_1.DomainError {
    statusCode = 404;
    constructor() {
        super('Usuário não encontrado.');
    }
}
exports.UserNotFoundError = UserNotFoundError;
//# sourceMappingURL=user-not-found.error.js.map