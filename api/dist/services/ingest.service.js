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
var IngestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestService = void 0;
const common_1 = require("@nestjs/common");
const chunker_service_1 = require("./chunker.service");
const extractors_1 = require("../utils/extractors");
const prisma_knowledge_chunk_repository_1 = require("../repositories/prisma/prisma-knowledge-chunk.repository");
const embedding_provider_1 = require("../providers/ai/embedding/embedding.provider");
let IngestService = IngestService_1 = class IngestService {
    chunker;
    embeddingProvider;
    knowledgeChunkRepo;
    logger = new common_1.Logger(IngestService_1.name);
    constructor(chunker, embeddingProvider, knowledgeChunkRepo) {
        this.chunker = chunker;
        this.embeddingProvider = embeddingProvider;
        this.knowledgeChunkRepo = knowledgeChunkRepo;
    }
    async ingestText(raw, source) {
        this.logger.log(`📝 Ingerindo texto: ${source}`);
        const text = (0, extractors_1.extractFromText)(raw);
        return this.processText(text, source);
    }
    async ingestPDF(buffer, source) {
        this.logger.log(`📄 Ingerindo PDF: ${source}`);
        const text = await (0, extractors_1.extractFromPDF)(buffer);
        return this.processText(text, source);
    }
    async ingestJSON(data, source) {
        this.logger.log(`🗂️  Ingerindo JSON: ${source}`);
        const text = (0, extractors_1.extractFromJSON)(data);
        return this.processText(text, source);
    }
    async processText(text, source, chunkSize, overlap) {
        const chunks = this.chunker.split(text, chunkSize, overlap);
        console.log(`${chunks.length} chunks gerados`);
        await this.knowledgeChunkRepo.deleteManyBySource(source);
        let saved = 0;
        for (const chunk of chunks) {
            const embedding = await this.embeddingProvider.generateEmbedding(chunk.content);
            const embeddingVector = this.embeddingProvider.formatVectorForPg(embedding);
            await this.knowledgeChunkRepo.insertChunk({
                content: chunk.content,
                embeddingVector,
                source,
                metadata: { chunkIndex: chunk.index },
            });
            saved++;
            await this.delay(80);
        }
        return {
            ok: true,
            source,
            chunksProcessed: chunks.length,
            chunksSaved: saved,
        };
    }
    delay(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }
};
exports.IngestService = IngestService;
exports.IngestService = IngestService = IngestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chunker_service_1.ChunkerService,
        embedding_provider_1.EmbeddingProvider,
        prisma_knowledge_chunk_repository_1.PrismaKnowledgeChunkRepository])
], IngestService);
//# sourceMappingURL=ingest.service.js.map