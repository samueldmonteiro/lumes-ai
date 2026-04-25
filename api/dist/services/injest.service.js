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
const extractors_1 = require("../lib/extractors");
const ollama_service_1 = require("./ollama.service");
let IngestService = IngestService_1 = class IngestService {
    chunker;
    ollama;
    logger = new common_1.Logger(IngestService_1.name);
    constructor(chunker, ollama) {
        this.chunker = chunker;
        this.ollama = ollama;
    }
    async ingestText(raw, source, category) {
        this.logger.log(`📝 Ingerindo texto: ${source}`);
        const text = (0, extractors_1.extractFromText)(raw);
        return this.processText(text, source, category);
    }
    async processText(text, source, category, chunkSize, overlap) {
        const chunks = this.chunker.split(text, chunkSize, overlap);
        this.logger.log(`   ${chunks.length} chunks gerados`);
        let saved = 0;
        for (const chunk of chunks) {
            try {
                const embedding = await this.ollama.generateEmbedding(chunk.content);
                await this.prisma.knowledgeChunk.create({
                    data: {
                        content: chunk.content,
                        embedding,
                        category,
                        source,
                        metadata: { chunkIndex: chunk.index },
                    },
                });
                saved++;
                await this.delay(80);
            }
            catch (err) {
                this.logger.error(`   Erro no chunk ${chunk.index}: ${err}`);
            }
        }
        this.logger.log(`   ✅ ${saved}/${chunks.length} chunks salvos`);
        return {
            ok: true,
            source,
            category,
            chunksProcessed: chunks.length,
            chunksSaved: saved,
        };
    }
};
exports.IngestService = IngestService;
exports.IngestService = IngestService = IngestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chunker_service_1.ChunkerService,
        ollama_service_1.OllamaService])
], IngestService);
//# sourceMappingURL=injest.service.js.map