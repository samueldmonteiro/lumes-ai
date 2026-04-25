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
var OllamaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
let OllamaService = OllamaService_1 = class OllamaService {
    logger = new common_1.Logger(OllamaService_1.name);
    baseUrl;
    embedModel;
    llmModel;
    constructor() {
        this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        this.embedModel = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
        this.llmModel = process.env.OLLAMA_LLM_MODEL || 'llama3.2';
    }
    async onModuleInit() {
        try {
            const res = await fetch(`${this.baseUrl}/api/tags`);
            if (!res.ok)
                throw new Error('Ollama não respondeu');
            this.logger.log(`✅ Ollama conectado em ${this.baseUrl}`);
            this.logger.log(`   Embed: ${this.embedModel} | LLM: ${this.llmModel}`);
        }
        catch {
            this.logger.error(`❌ Ollama não encontrado em ${this.baseUrl}`);
            this.logger.error('   Execute: ollama serve');
        }
    }
    async generateEmbedding(text) {
        const res = await fetch(`${this.baseUrl}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.embedModel,
                prompt: text,
            }),
        });
        if (!res.ok) {
            throw new Error(`Erro ao gerar embedding: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data.embedding;
    }
    async generateResponse(prompt) {
        const res = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.llmModel,
                prompt,
                stream: false,
                options: {
                    temperature: 0.3,
                    num_predict: 512,
                },
            }),
        });
        if (!res.ok) {
            throw new Error(`Erro no LLM: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data.response.trim();
    }
    formatVectorForPg(embedding) {
        return `[${embedding.join(',')}]`;
    }
};
exports.OllamaService = OllamaService;
exports.OllamaService = OllamaService = OllamaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OllamaService);
//# sourceMappingURL=ollama.service.js.map