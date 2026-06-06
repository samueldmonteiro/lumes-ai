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
exports.IngestController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const ingest_service_1 = require("../../services/ingest.service");
const base_controller_1 = require("./base.controller");
const ingest_dto_1 = require("../dtos/ingest.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const client_1 = require("../../generated/prisma/client");
const node_crypto_1 = require("node:crypto");
let IngestController = class IngestController extends base_controller_1.BaseController {
    ingestService;
    constructor(ingestService) {
        super();
        this.ingestService = ingestService;
    }
    async ingestText(body) {
        const result = await this.ingestService.ingestText(body.text, body.source ?? 'manual-' + (0, node_crypto_1.randomUUID)());
        return this.created(result, 'Texto ingerido com sucesso!');
    }
    async ingestPDF(file, source) {
        if (!file) {
            throw new common_1.BadRequestException('Nenhum arquivo PDF enviado.');
        }
        if (file.mimetype !== 'application/pdf') {
            throw new common_1.BadRequestException('Tipo de arquivo inválido. Apenas PDFs são aceitos.');
        }
        const finalSource = source ?? `pdf-${(0, node_crypto_1.randomUUID)()}`;
        const result = await this.ingestService.ingestPDF(file.buffer, finalSource);
        return this.created(result, 'PDF ingerido com sucesso!');
    }
    async ingestJson(body) {
        const result = await this.ingestService.ingestJSON(body.data, body.source ?? `json-${(0, node_crypto_1.randomUUID)()}`);
        return this.created(result, 'JSON ingerido com sucesso!');
    }
};
exports.IngestController = IngestController;
__decorate([
    (0, common_1.Post)('text'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ingere um texto bruto, transformando-o em chunks vetorizados',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Texto ingerido com sucesso',
        schema: {
            type: 'object',
            properties: {
                code: { type: 'number', example: 201 },
                ok: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Texto ingerido com sucesso!' },
                data: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean', example: true },
                        source: { type: 'string', example: 'manual-uuid' },
                        chunksProcessed: { type: 'number', example: 5 },
                        chunksSaved: { type: 'number', example: 5 },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_dto_1.IngestTextDto]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestText", null);
__decorate([
    (0, common_1.Post)('pdf'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ingere um arquivo PDF, extraindo texto e gerando chunks vetorizados',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'PDF ingerido com sucesso',
        schema: {
            type: 'object',
            properties: {
                code: { type: 'number', example: 201 },
                ok: { type: 'boolean', example: true },
                message: { type: 'string', example: 'PDF ingerido com sucesso!' },
                data: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean', example: true },
                        source: { type: 'string', example: 'pdf-uuid' },
                        chunksProcessed: { type: 'number', example: 5 },
                        chunksSaved: { type: 'number', example: 5 },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Arquivo PDF e origem opcional',
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo PDF (.pdf)',
                },
                source: {
                    type: 'string',
                    description: 'Origem do documento para rastreabilidade',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestPDF", null);
__decorate([
    (0, common_1.Post)('json'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ingere um objeto JSON, achatando-o em texto e gerando chunks vetorizados',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'JSON ingerido com sucesso',
        schema: {
            type: 'object',
            properties: {
                code: { type: 'number', example: 201 },
                ok: { type: 'boolean', example: true },
                message: { type: 'string', example: 'JSON ingerido com sucesso!' },
                data: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean', example: true },
                        source: { type: 'string', example: 'json-uuid' },
                        chunksProcessed: { type: 'number', example: 5 },
                        chunksSaved: { type: 'number', example: 5 },
                    },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_dto_1.IngestJsonDto]),
    __metadata("design:returntype", Promise)
], IngestController.prototype, "ingestJson", null);
exports.IngestController = IngestController = __decorate([
    (0, swagger_1.ApiTags)('Ingest'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Controller)('ingests'),
    __metadata("design:paramtypes", [ingest_service_1.IngestService])
], IngestController);
//# sourceMappingURL=ingest.controller.js.map