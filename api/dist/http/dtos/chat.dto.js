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
exports.ChatRequestDto = exports.ChatMessageDto = void 0;
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
    (0, class_validator_1.MinLength)(3, { message: 'A pergunta é muito curta' }),
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
//# sourceMappingURL=chat.dto.js.map