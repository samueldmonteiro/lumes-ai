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
const ollama_service_1 = require("./ollama.service");
const prisma_1 = require("../lib/prisma");
let SearchService = SearchService_1 = class SearchService {
    ollama;
    logger = new common_1.Logger(SearchService_1.name);
    topK;
    minSimilarity;
    constructor(ollama) {
        this.ollama = ollama;
        this.topK = parseInt(process.env.SEARCH_TOP_K || '4');
        this.minSimilarity = parseFloat(process.env.SEARCH_MIN_SIMILARITY || '0.5');
    }
    async findSimilarChunks(question, topK) {
        const embedding = await this.ollama.generateEmbedding(question);
        const vector = this.ollama.formatVectorForPg(embedding);
        const limit = topK ?? this.topK;
        const rows = await prisma_1.prisma.$queryRaw `
      SELECT
         id,
         content,
         category,
         source,
         1 - (embedding <=> ${vector}::vector) AS similarity
       FROM knowledge_chunks
       WHERE 1 - (embedding <=> ${vector}::vector) > ${this.minSimilarity}
       ORDER BY embedding <=> ${vector}::vector
       LIMIT ${limit}
    `;
        this.logger.log(`🔍 "${question}" → ${rows.length} chunks encontrados`);
        return rows;
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = SearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ollama_service_1.OllamaService])
], SearchService);
//# sourceMappingURL=search.service.js.map