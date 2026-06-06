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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../../services/user.service");
const base_controller_1 = require("./base.controller");
const dtos_1 = require("../dtos");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
let UserController = class UserController extends base_controller_1.BaseController {
    userService;
    constructor(userService) {
        super();
        this.userService = userService;
    }
    async updateProfile(user, body) {
        const updated = await this.userService.updateProfile(Number(user.sub), body);
        return this.success(updated, 'Perfil atualizado com sucesso');
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualiza o perfil do usuário logado (PATCH)',
        description: 'Permite atualizar parcialmente nome, e-mail e/ou senha. Todos os campos são opcionais.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Perfil atualizado com sucesso.',
        type: dtos_1.UpdateProfileResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Dados inválidos (e-mail mal formatado, senha curta, etc.).',
        type: dtos_1.BadRequestResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Token JWT ausente ou inválido.',
        type: dtos_1.UnauthorizedResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Usuário não encontrado.',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'O novo e-mail já está em uso por outra conta.',
        type: dtos_1.ConflictResponseDto,
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map