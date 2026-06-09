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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundResponseDto = exports.UnauthorizedResponseDto = exports.BadRequestResponseDto = exports.DeleteSessionResponseDto = exports.ChatSessionDetailsResponseDto = exports.ChatSessionDetailsDto = exports.ChatLogDetailDto = exports.ChatSessionsResponseDto = exports.ChatSessionDto = exports.ChatHistoryResponseDto = exports.ChatLogEntryDto = exports.AskResponseDto = exports.ChatResponseDto = exports.ChatRequestDto = exports.ChatMessageDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ChatMessageDto {
    role;
    content;
}
exports.ChatMessageDto = ChatMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user', enum: ['user', 'model'] }),
    (0, class_validator_1.IsString)({ message: 'O papel deve ser um texto válido' }),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Qual é o horário da biblioteca?' }),
    (0, class_validator_1.IsString)({ message: 'O conteúdo deve ser um texto válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O conteúdo não pode estar vazio' }),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "content", void 0);
class ChatRequestDto {
    question;
    sessionId;
    history;
}
exports.ChatRequestDto = ChatRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'A pergunta ou dúvida do aluno para o assistente virtual',
        example: 'Quais são os cursos disponíveis na faculdade?',
    }),
    (0, class_validator_1.IsString)({ message: 'A pergunta deve ser um texto válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A pergunta não pode estar vazia' }),
    (0, class_validator_1.MinLength)(1, { message: 'A pergunta é muito curta' }),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da sessão de chat persistida (apenas para usuários autenticados)',
        required: false,
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'O ID da sessão deve ser um texto válido' }),
    __metadata("design:type", String)
], ChatRequestDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Histórico da conversa atual (usado para usuários deslogados)',
        type: [ChatMessageDto],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'O histórico deve ser uma lista de mensagens' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ChatMessageDto),
    __metadata("design:type", Array)
], ChatRequestDto.prototype, "history", void 0);
class ChatResponseDto {
    answer;
    sources;
    avgSimilarity;
    chunksUsed;
    sessionId;
}
exports.ChatResponseDto = ChatResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Resposta textual gerada pelo assistente virtual',
        example: 'Os cursos disponíveis incluem Engenharia de Software, Ciência da Computação e Sistemas de Informação.',
    }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de fontes/documentos de onde a informação foi extraída',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                source: { type: 'string', example: 'cursos_ti.pdf' },
                similarity: { type: 'number', example: 0.85 },
            },
        },
    }),
    __metadata("design:type", Array)
], ChatResponseDto.prototype, "sources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Média de similaridade cosseno dos trechos encontrados',
        example: 0.85,
    }),
    __metadata("design:type", Number)
], ChatResponseDto.prototype, "avgSimilarity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quantidade de trechos (chunks) de informação utilizados no contexto',
        example: 2,
    }),
    __metadata("design:type", Number)
], ChatResponseDto.prototype, "chunksUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da sessão de chat associada (se aplicável)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    __metadata("design:type", String)
], ChatResponseDto.prototype, "sessionId", void 0);
class AskResponseDto {
    code;
    ok;
    message;
    data;
}
exports.AskResponseDto = AskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], AskResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AskResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pergunta processada com sucesso' }),
    __metadata("design:type", String)
], AskResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatResponseDto }),
    __metadata("design:type", ChatResponseDto)
], AskResponseDto.prototype, "data", void 0);
class ChatLogEntryDto {
    id;
    question;
    answer;
    similarity;
    createdAt;
}
exports.ChatLogEntryDto = ChatLogEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ChatLogEntryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quais são os cursos?' }),
    __metadata("design:type", String)
], ChatLogEntryDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Os cursos são...' }),
    __metadata("design:type", String)
], ChatLogEntryDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.82, nullable: true }),
    __metadata("design:type", Object)
], ChatLogEntryDto.prototype, "similarity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-06T18:04:18.000Z' }),
    __metadata("design:type", Date)
], ChatLogEntryDto.prototype, "createdAt", void 0);
class ChatHistoryResponseDto {
    code;
    ok;
    message;
    data;
}
exports.ChatHistoryResponseDto = ChatHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], ChatHistoryResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ChatHistoryResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Histórico recuperado com sucesso' }),
    __metadata("design:type", String)
], ChatHistoryResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChatLogEntryDto] }),
    __metadata("design:type", Array)
], ChatHistoryResponseDto.prototype, "data", void 0);
class ChatSessionDto {
    id;
    title;
    userId;
    createdAt;
    updatedAt;
}
exports.ChatSessionDto = ChatSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], ChatSessionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dúvida sobre horário' }),
    __metadata("design:type", String)
], ChatSessionDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ChatSessionDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-06T18:04:18.000Z' }),
    __metadata("design:type", Date)
], ChatSessionDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-06T18:04:18.000Z' }),
    __metadata("design:type", Date)
], ChatSessionDto.prototype, "updatedAt", void 0);
class ChatSessionsResponseDto {
    code;
    ok;
    message;
    data;
}
exports.ChatSessionsResponseDto = ChatSessionsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], ChatSessionsResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ChatSessionsResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sessões recuperadas com sucesso' }),
    __metadata("design:type", String)
], ChatSessionsResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChatSessionDto] }),
    __metadata("design:type", Array)
], ChatSessionsResponseDto.prototype, "data", void 0);
class ChatLogDetailDto {
    id;
    question;
    answer;
    sources;
    similarity;
    createdAt;
    userId;
    sessionId;
}
exports.ChatLogDetailDto = ChatLogDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ChatLogDetailDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quais são os cursos?' }),
    __metadata("design:type", String)
], ChatLogDetailDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Os cursos são...' }),
    __metadata("design:type", String)
], ChatLogDetailDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                source: { type: 'string', example: 'regulamento.pdf' },
                similarity: { type: 'number', example: 0.85 },
            },
        },
    }),
    __metadata("design:type", Object)
], ChatLogDetailDto.prototype, "sources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0.82, nullable: true }),
    __metadata("design:type", Object)
], ChatLogDetailDto.prototype, "similarity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-06T18:04:18.000Z' }),
    __metadata("design:type", Date)
], ChatLogDetailDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ChatLogDetailDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true,
    }),
    __metadata("design:type", Object)
], ChatLogDetailDto.prototype, "sessionId", void 0);
class ChatSessionDetailsDto {
    id;
    title;
    userId;
    createdAt;
    updatedAt;
    chatLogs;
}
exports.ChatSessionDetailsDto = ChatSessionDetailsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], ChatSessionDetailsDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dúvida sobre horário' }),
    __metadata("design:type", String)
], ChatSessionDetailsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ChatSessionDetailsDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-06T18:04:18.000Z' }),
    __metadata("design:type", Date)
], ChatSessionDetailsDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-06-06T18:04:18.000Z' }),
    __metadata("design:type", Date)
], ChatSessionDetailsDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChatLogDetailDto] }),
    __metadata("design:type", Array)
], ChatSessionDetailsDto.prototype, "chatLogs", void 0);
class ChatSessionDetailsResponseDto {
    code;
    ok;
    message;
    data;
}
exports.ChatSessionDetailsResponseDto = ChatSessionDetailsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], ChatSessionDetailsResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ChatSessionDetailsResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Detalhes da sessão recuperados com sucesso' }),
    __metadata("design:type", String)
], ChatSessionDetailsResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ChatSessionDetailsDto }),
    __metadata("design:type", ChatSessionDetailsDto)
], ChatSessionDetailsResponseDto.prototype, "data", void 0);
class DeleteSessionResponseDto {
    code;
    ok;
    message;
    data;
}
exports.DeleteSessionResponseDto = DeleteSessionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], DeleteSessionResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], DeleteSessionResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sessão excluída com sucesso' }),
    __metadata("design:type", String)
], DeleteSessionResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Object, nullable: true, example: null }),
    __metadata("design:type", Object)
], DeleteSessionResponseDto.prototype, "data", void 0);
class BadRequestResponseDto {
    code;
    ok;
    message;
}
exports.BadRequestResponseDto = BadRequestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400 }),
    __metadata("design:type", Number)
], BadRequestResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], BadRequestResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A pergunta deve ser um texto válido' }),
    __metadata("design:type", String)
], BadRequestResponseDto.prototype, "message", void 0);
class UnauthorizedResponseDto {
    code;
    ok;
    message;
}
exports.UnauthorizedResponseDto = UnauthorizedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 401 }),
    __metadata("design:type", Number)
], UnauthorizedResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], UnauthorizedResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Unauthorized' }),
    __metadata("design:type", String)
], UnauthorizedResponseDto.prototype, "message", void 0);
class NotFoundResponseDto {
    code;
    ok;
    message;
}
exports.NotFoundResponseDto = NotFoundResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 404 }),
    __metadata("design:type", Number)
], NotFoundResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], NotFoundResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sessão de chat não encontrada.' }),
    __metadata("design:type", String)
], NotFoundResponseDto.prototype, "message", void 0);
//# sourceMappingURL=chat.dto.js.map