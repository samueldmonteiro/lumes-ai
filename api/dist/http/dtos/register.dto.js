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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterDto {
    email;
    password;
    name;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'E-mail do usuário',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'O e-mail informado deve ser válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail não pode estar vazio' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Senha de acesso',
        example: 'senha123',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)({ message: 'A senha deve ser um texto válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A senha não pode estar vazia' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome completo do usuário',
        example: 'João Silva',
    }),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser um texto válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode estar vazio' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
//# sourceMappingURL=register.dto.js.map