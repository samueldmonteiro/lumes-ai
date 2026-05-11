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
exports.OllamaEmbeddingProvider = void 0;
const common_1 = require("@nestjs/common");
let OllamaEmbeddingProvider = class OllamaEmbeddingProvider {
    baseUrl;
    embedModel;
    constructor() {
        this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        this.embedModel = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';
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
    formatVectorForPg(embedding) {
        return `[${embedding.join(',')}]`;
    }
};
exports.OllamaEmbeddingProvider = OllamaEmbeddingProvider;
exports.OllamaEmbeddingProvider = OllamaEmbeddingProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OllamaEmbeddingProvider);
//# sourceMappingURL=ollama.embedding-provider.js.map