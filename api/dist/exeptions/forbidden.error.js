"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const domain_error_1 = require("./domain.error");
class ForbiddenError extends domain_error_1.DomainError {
    statusCode = 403;
    constructor(message = 'Acesso negado: permissões insuficientes.') {
        super(message);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=forbidden.error.js.map