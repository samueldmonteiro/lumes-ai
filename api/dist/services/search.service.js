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
const client_1 = require("../generated/prisma/client");
const prisma_1 = require("../lib/prisma");
const embedding_provider_1 = require("../ai/embedding-providers/embedding-provider");
let SearchService = SearchService_1 = class SearchService {
    embeddingProvider;
    logger = new common_1.Logger(SearchService_1.name);
    topK;
    minSimilarity;
    constructor(embeddingProvider) {
        this.embeddingProvider = embeddingProvider;
        this.topK = parseInt(process.env.SEARCH_TOP_K || '4');
        this.minSimilarity = parseFloat(process.env.SEARCH_MIN_SIMILARITY || '0.5');
    }
    async findSimilarChunks(question, topK) {
        const embedding = await this.embeddingProvider.generateEmbedding(question);
        const vector = this.embeddingProvider.formatVectorForPg(embedding);
        const limit = topK ?? this.topK;
        const vectorLiteral = client_1.Prisma.raw(`'${vector}'::vector`);
        const minSim = client_1.Prisma.raw(String(this.minSimilarity));
        const limitRaw = client_1.Prisma.raw(String(limit));
        const debugRows = await prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT id, source, 1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM knowledge_chunks
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT 5
      `);
        this.logger.debug(`📊 Top-5 similaridades brutas para "${question}":\n` +
            debugRows.map(r => `  [${r.id}] ${r.source} → ${Number(r.similarity).toFixed(4)}`).join('\n'));
        const rows = await prisma_1.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT
          id,
          content,
          category,
          source,
          1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM knowledge_chunks
        WHERE 1 - (embedding <=> ${vectorLiteral}) > ${minSim}
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT ${limitRaw}
      `);
        this.logger.log(`🔍 "${question}" → ${rows.length} chunks encontrados (threshold: ${this.minSimilarity})`);
        return rows;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [embedding_provider_1.EmbeddingProvider])
], SearchService);
//# sourceMappingURL=search.service.js.map