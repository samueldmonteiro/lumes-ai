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
exports.IngestTextDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class IngestTextDto {
    text;
    source;
    category;
}
exports.IngestTextDto = IngestTextDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Texto bruto para ser processado e transformado em chunks',
        example: 'O sistema Lumes AI utiliza RAG para responder perguntas...',
    }),
    (0, class_validator_1.IsString)({ message: 'O campo text deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O campo text é obrigatório' }),
    (0, class_validator_1.MinLength)(10, { message: 'O texto deve ter pelo menos 10 caracteres' }),
    __metadata("design:type", String)
], IngestTextDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Origem do documento para rastreabilidade',
        example: 'manual',
        required: false,
        default: 'manual',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IngestTextDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoria para agrupar o conhecimento',
        example: 'geral',
        required: false,
        default: 'geral',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IngestTextDto.prototype, "category", void 0);
//# sourceMappingURL=ingest.dto.js.map