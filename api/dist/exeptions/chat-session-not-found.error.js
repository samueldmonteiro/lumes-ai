"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionNotFoundError = void 0;
const domain_error_1 = require("./domain.error");
class ChatSessionNotFoundError extends domain_error_1.DomainError {
    statusCode = 404;
    constructor(message = 'Sessão de chat não encontrada.') {
        super(message);
    }
}
exports.ChatSessionNotFoundError = ChatSessionNotFoundError;
//# sourceMappingURL=chat-session-not-found.error.js.map