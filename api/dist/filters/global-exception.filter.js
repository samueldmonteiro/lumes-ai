"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const domain_error_1 = require("../exeptions/domain.error");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const errorResponse = this.buildErrorResponse(exception, request);
        if (errorResponse.code >= 500) {
            this.logger.error(`[${request.method}] ${request.url} → ${errorResponse.code}`, exception instanceof Error ? exception.stack : String(exception));
        }
        else {
            this.logger.warn(`[${request.method}] ${request.url} → ${errorResponse.code} — ${Array.isArray(errorResponse.message) ? errorResponse.message.join(', ') : errorResponse.message}`);
        }
        response.status(errorResponse.code).json(errorResponse);
    }
    buildErrorResponse(exception, request) {
        const timestamp = new Date().toISOString();
        const path = request.url;
        if (exception instanceof domain_error_1.DomainError) {
            return {
                code: exception.statusCode,
                error: this.statusText(exception.statusCode),
                message: exception.message,
                path,
                timestamp,
                ok: false,
            };
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const body = exception.getResponse();
            const message = typeof body === 'string'
                ? body
                : body.message ?? exception.message;
            return {
                code: status,
                error: this.statusText(status),
                message: message,
                path,
                timestamp,
                ok: false,
            };
        }
        return {
            code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
            message: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            path,
            timestamp,
            ok: false,
        };
    }
    statusText(status) {
        const map = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            409: 'Conflict',
            422: 'Unprocessable Entity',
            429: 'Too Many Requests',
            500: 'Internal Server Error',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
        };
        return map[status] ?? 'Error';
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map