"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("../../services/chat.service");
const base_controller_1 = require("./base.controller");
const chat_dto_1 = require("../dtos/chat.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const public_decorator_1 = require("../decorators/public.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
let ChatController = class ChatController extends base_controller_1.BaseController {
    chatService;
    constructor(chatService) {
        super();
        this.chatService = chatService;
    }
    async ask(body, user) {
        const response = await this.chatService.ask(body.question, user ?? null, body.sessionId, body.history);
        return this.success(response, 'Pergunta processada com sucesso');
    }
    async getHistory(user, limit) {
        const history = await this.chatService.getHistory(limit ? Number(limit) : undefined, user);
        return this.success(history, 'Histórico recuperado com sucesso');
    }
    async getSessions(user, limit) {
        const sessions = await this.chatService.getSessions(Number(user.sub), limit ? Number(limit) : undefined);
        return this.success(sessions, 'Sessões recuperadas com sucesso');
    }
    async getSessionDetails(id, user) {
        const session = await this.chatService.getSessionDetails(id, Number(user.sub));
        return this.success(session, 'Detalhes da sessão recuperados com sucesso');
    }
    async deleteSession(id, user) {
        await this.chatService.deleteSession(id, Number(user.sub));
        return this.success(null, 'Sessão excluída com sucesso');
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('ask'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Envia uma pergunta ao assistente virtual (RAG)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Pergunta processada com sucesso. Retorna a resposta gerada e as fontes utilizadas.',
        type: chat_dto_1.AskResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Erros de validação nos dados enviados.',
        type: chat_dto_1.BadRequestResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_dto_1.ChatRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "ask", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Recupera o histórico de conversas avulsas' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Quantidade máxima de registros a retornar (padrão: 20)',
        example: 10,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Histórico recuperado com sucesso.',
        type: chat_dto_1.ChatHistoryResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT ausente ou inválido.',
        type: chat_dto_1.UnauthorizedResponseDto,
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, swagger_1.ApiOperation)({
        summary: 'Recupera a lista de sessões de chat do usuário logado',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Quantidade máxima de sessões a retornar (padrão: 20)',
        example: 10,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista de sessões recuperada com sucesso.',
        type: chat_dto_1.ChatSessionsResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT ausente ou inválido.',
        type: chat_dto_1.UnauthorizedResponseDto,
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Recupera os detalhes de uma sessão de chat (com histórico de mensagens)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'UUID da sessão de chat',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Detalhes da sessão recuperados com sucesso.',
        type: chat_dto_1.ChatSessionDetailsResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT ausente ou inválido.',
        type: chat_dto_1.UnauthorizedResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Sessão de chat não encontrada ou não pertence ao usuário.',
        type: chat_dto_1.NotFoundResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getSessionDetails", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Exclui uma sessão de chat' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        type: String,
        description: 'UUID da sessão de chat',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Sessão excluída com sucesso.',
        type: chat_dto_1.DeleteSessionResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT ausente ou inválido.',
        type: chat_dto_1.UnauthorizedResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Sessão de chat não encontrada ou não pertence ao usuário.',
        type: chat_dto_1.NotFoundResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteSession", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map