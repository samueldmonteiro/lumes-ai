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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../../services/auth.service");
const base_controller_1 = require("./base.controller");
const dtos_1 = require("../dtos");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const auth_dto_1 = require("../dtos/auth.dto");
let AuthController = class AuthController extends base_controller_1.BaseController {
    authService;
    constructor(authService) {
        super();
        this.authService = authService;
    }
    async register(body) {
        const user = await this.authService.register(body);
        return this.created(user, 'Usuário registrado com sucesso');
    }
    async login(body) {
        const result = await this.authService.login(body);
        return this.success(result, 'Autenticação realizada com sucesso');
    }
    me(user) {
        return this.success(user, 'Perfil do usuário recuperado com sucesso');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registra um novo usuário' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Usuário registrado com sucesso. Retorna os dados do usuário e o token JWT.',
        type: dtos_1.RegisterResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Erros de validação nos dados enviados (e-mail inválido, senha muito curta, etc.).',
        type: dtos_1.BadRequestResponseDto,
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'E-mail já cadastrado no sistema.',
        type: auth_dto_1.ConflictResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Autentica um usuário e gera o token JWT' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Autenticação realizada com sucesso. Retorna o token JWT e os dados do usuário.',
        type: dtos_1.LoginResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Erros de validação nos dados enviados.',
        type: dtos_1.BadRequestResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'E-mail ou senha inválidos.',
        type: dtos_1.UnauthorizedResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna o perfil do usuário logado' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Perfil do usuário recuperado com sucesso.',
        type: dtos_1.MeResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT ausente ou inválido.',
        type: dtos_1.UnauthorizedResponseDto,
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map