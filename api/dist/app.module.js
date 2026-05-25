"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const app_controller_1 = require("./http/controllers/app.controller");
const ingest_controller_1 = require("./http/controllers/ingest.controller");
const ingest_service_1 = require("./services/ingest.service");
const chunker_service_1 = require("./services/chunker.service");
const search_service_1 = require("./services/search.service");
const prompt_service_1 = require("./services/prompt.service");
const chat_controller_1 = require("./http/controllers/chat.controller");
const chat_service_1 = require("./services/chat.service");
const gemini_provider_1 = require("./providers/ai/LLM/gemini.provider");
const prisma_service_1 = require("./services/prisma.service");
const embedding_provider_1 = require("./providers/ai/embedding/embedding.provider");
const ollama_embedding_provider_1 = require("./providers/ai/embedding/ollama-embedding.provider");
const llm_provider_1 = require("./providers/ai/LLM/llm.provider");
const auth_service_1 = require("./services/auth.service");
const auth_controller_1 = require("./http/controllers/auth.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || process.env.JWT_TOKEN || 'fallback-secret',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [app_controller_1.AppController, ingest_controller_1.IngestController, chat_controller_1.ChatController, auth_controller_1.AuthController],
        providers: [
            prisma_service_1.PrismaService,
            ingest_service_1.IngestService,
            chunker_service_1.ChunkerService,
            search_service_1.SearchService,
            prompt_service_1.PromptService,
            chat_service_1.ChatService,
            auth_service_1.AuthService,
            gemini_provider_1.GeminiProvider,
            {
                provide: llm_provider_1.LLMProvider,
                useClass: gemini_provider_1.GeminiProvider,
            },
            {
                provide: embedding_provider_1.EmbeddingProvider,
                useClass: ollama_embedding_provider_1.OllamaEmbeddingProvider,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map