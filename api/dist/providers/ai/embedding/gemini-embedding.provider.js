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
exports.GeminiEmbeddingProvider = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
let GeminiEmbeddingProvider = class GeminiEmbeddingProvider {
    ai;
    embedModel;
    constructor() {
        this.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        this.embedModel = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-2';
    }
    async generateEmbedding(text) {
        const response = await this.ai.models.embedContent({
            model: this.embedModel,
            contents: text,
        });
        const embedding = response.embeddings?.[0]?.values;
        if (!embedding) {
            throw new Error('Falha ao gerar embedding com Gemini');
        }
        return embedding;
    }
    formatVectorForPg(embedding) {
        return `[${embedding.join(',')}]`;
    }
};
exports.GeminiEmbeddingProvider = GeminiEmbeddingProvider;
exports.GeminiEmbeddingProvider = GeminiEmbeddingProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GeminiEmbeddingProvider);
//# sourceMappingURL=gemini-embedding.provider.js.map