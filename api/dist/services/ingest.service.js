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
const prisma_1 = require("../lib/prisma");
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
        console.log('texto extraido', text);
        const processed = await this.processText(text, source, category);
        console.log('Processado', processed);
        return processed;
    }
    async processText(text, source, category, chunkSize, overlap) {
        const chunks = this.chunker.split(text, chunkSize, overlap);
        this.logger.log(`   ${chunks.length} chunks gerados`);
        try {
            const deleted = await prisma_1.prisma.knowledgeChunk.deleteMany({
                where: { source },
            });
            if (deleted.count > 0) {
                this.logger.log(`   🗑️ Limpou ${deleted.count} chunks antigos para a fonte: ${source}`);
            }
        }
        catch (error) {
            this.logger.warn(`   Aviso ao tentar limpar chunks antigos: ${error.message}`);
        }
        let saved = 0;
        console.log('Chunks gerados e prontos para embedding');
        for (const chunk of chunks) {
            try {
                const contextAwareText = `Documento: ${source}\nCategoria: ${category}\n\n${chunk.content}`;
                const embedding = await this.ollama.generateEmbedding(contextAwareText);
                const vectorStr = this.ollama.formatVectorForPg(embedding);
                await prisma_1.prisma.$executeRaw `
          INSERT INTO "knowledge_chunks" ("content", "embedding", "category", "source", "metadata", "updatedAt")
          VALUES (
            ${chunk.content}, 
            ${vectorStr}::vector, 
            ${category}, 
            ${source}, 
            ${{ chunkIndex: chunk.index }}::jsonb,
            NOW()
          )
        `;
                saved++;
                await this.delay(80);
            }
            catch (err) {
                this.logger.error(`Erro no chunk ${chunk.index}: ${err.message}`);
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
    delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
};
exports.IngestService = IngestService;
exports.IngestService = IngestService = IngestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chunker_service_1.ChunkerService,
        ollama_service_1.OllamaService])
], IngestService);
//# sourceMappingURL=ingest.service.js.map