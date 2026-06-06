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
exports.UpdateProfileResponseDto = exports.UpdatedUserDto = exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateProfileDto {
    email;
    name;
    password;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Novo e-mail do usuário',
        example: 'novo@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'O e-mail informado deve ser válido' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Novo nome completo do usuário',
        example: 'Maria Oliveira',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser um texto válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode estar vazio' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nova senha de acesso (mínimo 6 caracteres)',
        example: 'novaSenha123',
        minLength: 6,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'A senha deve ser um texto válido' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "password", void 0);
class UpdatedUserDto {
    id;
    email;
    name;
    role;
    createdAt;
    updatedAt;
}
exports.UpdatedUserDto = UpdatedUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID do usuário' }),
    __metadata("design:type", Number)
], UpdatedUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'novo@example.com',
        description: 'E-mail do usuário',
    }),
    __metadata("design:type", String)
], UpdatedUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maria Oliveira', description: 'Nome completo' }),
    __metadata("design:type", String)
], UpdatedUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'USER',
        enum: ['USER', 'ADMIN'],
        description: 'Papel do usuário',
    }),
    __metadata("design:type", String)
], UpdatedUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-06-06T18:04:18.000Z',
        description: 'Data de criação',
    }),
    __metadata("design:type", Date)
], UpdatedUserDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-06-06T19:10:00.000Z',
        description: 'Data de atualização',
    }),
    __metadata("design:type", Date)
], UpdatedUserDto.prototype, "updatedAt", void 0);
class UpdateProfileResponseDto {
    code;
    ok;
    message;
    data;
}
exports.UpdateProfileResponseDto = UpdateProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], UpdateProfileResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UpdateProfileResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Perfil atualizado com sucesso' }),
    __metadata("design:type", String)
], UpdateProfileResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UpdatedUserDto }),
    __metadata("design:type", UpdatedUserDto)
], UpdateProfileResponseDto.prototype, "data", void 0);
//# sourceMappingURL=user.dto.js.map