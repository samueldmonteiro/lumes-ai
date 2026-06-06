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
var SearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const prisma_knowledge_chunk_repository_1 = require("../repositories/prisma/prisma-knowledge-chunk.repository");
const embedding_provider_1 = require("../providers/ai/embedding/embedding.provider");
let SearchService = SearchService_1 = class SearchService {
    embeddingProvider;
    knowledgeChunkRepo;
    logger = new common_1.Logger(SearchService_1.name);
    topK;
    minSimilarity;
    constructor(embeddingProvider, knowledgeChunkRepo) {
        this.embeddingProvider = embeddingProvider;
        this.knowledgeChunkRepo = knowledgeChunkRepo;
        this.topK = parseInt(process.env.SEARCH_TOP_K || '4');
        this.minSimilarity = parseFloat(process.env.SEARCH_MIN_SIMILARITY || '0.5');
    }
    async findSimilarChunks(question, topK) {
        const embedding = await this.embeddingProvider.generateEmbedding(question);
        const vector = this.embeddingProvider.formatVectorForPg(embedding);
        const limit = topK ?? this.topK;
        const debugRows = await this.knowledgeChunkRepo.getTopKSimilarities(vector, 5);
        this.logger.debug(`📊 Top-5 similaridades brutas para "${question}":\n` +
            debugRows
                .map((r) => `  [${r.id}] ${r.source} → ${Number(r.similarity).toFixed(4)}`)
                .join('\n'));
        const rows = await this.knowledgeChunkRepo.findSimilarChunks(vector, limit, this.minSimilarity);
        this.logger.log(`🔍 "${question}" → ${rows.length} chunks encontrados (threshold: ${this.minSimilarity})`);
        return rows;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [embedding_provider_1.EmbeddingProvider,
        prisma_knowledge_chunk_repository_1.PrismaKnowledgeChunkRepository])
], SearchService);
//# sourceMappingURL=search.service.js.map