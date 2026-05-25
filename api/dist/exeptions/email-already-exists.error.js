"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyExistsError = void 0;
const domain_error_1 = require("./domain.error");
class EmailAlreadyExistsError extends domain_error_1.DomainError {
    statusCode = 409;
    constructor() {
        super('Este e-mail já está em uso.');
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
//# sourceMappingURL=email-already-exists.error.js.map