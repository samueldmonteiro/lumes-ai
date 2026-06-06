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
exports.MeResponseDto = exports.ConflictResponseDto = exports.MeResponseDataDto = exports.LoginResponseDto = exports.LoginResponseDataDto = exports.RegisterResponseDto = exports.RegisterResponseDataDto = exports.LoginUserDto = exports.AuthUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AuthUserDto {
    id;
    email;
    name;
    role;
    createdAt;
    updatedAt;
}
exports.AuthUserDto = AuthUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID do usuário' }),
    __metadata("design:type", Number)
], AuthUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'E-mail do usuário',
    }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'João Silva',
        description: 'Nome completo do usuário',
    }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'USER',
        enum: ['USER', 'ADMIN'],
        description: 'Papel do usuário',
    }),
    __metadata("design:type", String)
], AuthUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-06-06T18:04:18.000Z',
        description: 'Data de criação',
    }),
    __metadata("design:type", Date)
], AuthUserDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-06-06T18:04:18.000Z',
        description: 'Data de atualização',
    }),
    __metadata("design:type", Date)
], AuthUserDto.prototype, "updatedAt", void 0);
class LoginUserDto {
    id;
    email;
    name;
    role;
}
exports.LoginUserDto = LoginUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID do usuário' }),
    __metadata("design:type", Number)
], LoginUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'E-mail do usuário',
    }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'João Silva',
        description: 'Nome completo do usuário',
    }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'USER',
        enum: ['USER', 'ADMIN'],
        description: 'Papel do usuário',
    }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "role", void 0);
class RegisterResponseDataDto {
    token;
    user;
}
exports.RegisterResponseDataDto = RegisterResponseDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token JWT de autenticação',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], RegisterResponseDataDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: AuthUserDto,
        description: 'Dados do usuário registrado',
    }),
    __metadata("design:type", AuthUserDto)
], RegisterResponseDataDto.prototype, "user", void 0);
class RegisterResponseDto {
    code;
    ok;
    message;
    data;
}
exports.RegisterResponseDto = RegisterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 201 }),
    __metadata("design:type", Number)
], RegisterResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], RegisterResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Usuário registrado com sucesso' }),
    __metadata("design:type", String)
], RegisterResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RegisterResponseDataDto }),
    __metadata("design:type", RegisterResponseDataDto)
], RegisterResponseDto.prototype, "data", void 0);
class LoginResponseDataDto {
    token;
    user;
}
exports.LoginResponseDataDto = LoginResponseDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token JWT de autenticação',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], LoginResponseDataDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: LoginUserDto,
        description: 'Dados do usuário autenticado',
    }),
    __metadata("design:type", LoginUserDto)
], LoginResponseDataDto.prototype, "user", void 0);
class LoginResponseDto {
    code;
    ok;
    message;
    data;
}
exports.LoginResponseDto = LoginResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], LoginResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], LoginResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Autenticação realizada com sucesso' }),
    __metadata("design:type", String)
], LoginResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: LoginResponseDataDto }),
    __metadata("design:type", LoginResponseDataDto)
], LoginResponseDto.prototype, "data", void 0);
class MeResponseDataDto {
    sub;
    email;
    role;
    iat;
    exp;
}
exports.MeResponseDataDto = MeResponseDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID do usuário (sub do JWT)' }),
    __metadata("design:type", String)
], MeResponseDataDto.prototype, "sub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'E-mail do usuário',
    }),
    __metadata("design:type", String)
], MeResponseDataDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'USER',
        enum: ['USER', 'ADMIN'],
        description: 'Papel do usuário',
    }),
    __metadata("design:type", String)
], MeResponseDataDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1717711458,
        description: 'Timestamp de emissão do token',
    }),
    __metadata("design:type", Number)
], MeResponseDataDto.prototype, "iat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1717715058,
        description: 'Timestamp de expiração do token',
    }),
    __metadata("design:type", Number)
], MeResponseDataDto.prototype, "exp", void 0);
class ConflictResponseDto {
    code;
    ok;
    message;
}
exports.ConflictResponseDto = ConflictResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 409 }),
    __metadata("design:type", Number)
], ConflictResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ConflictResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Este e-mail já está cadastrado.' }),
    __metadata("design:type", String)
], ConflictResponseDto.prototype, "message", void 0);
class MeResponseDto {
    code;
    ok;
    message;
    data;
}
exports.MeResponseDto = MeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], MeResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], MeResponseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Perfil do usuário recuperado com sucesso' }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MeResponseDataDto }),
    __metadata("design:type", MeResponseDataDto)
], MeResponseDto.prototype, "data", void 0);
//# sourceMappingURL=auth.dto.js.map