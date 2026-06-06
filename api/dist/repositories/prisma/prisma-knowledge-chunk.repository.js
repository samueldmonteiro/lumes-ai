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
exports.PrismaKnowledgeChunkRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../services/prisma.service");
let PrismaKnowledgeChunkRepository = class PrismaKnowledgeChunkRepository {
    prisma;
    schema;
    constructor(prisma) {
        this.prisma = prisma;
        this.schema = prisma.schema;
    }
    tbl(name) {
        return `"${this.schema}"."${name}"`;
    }
    async deleteManyBySource(source) {
        const result = await this.prisma.knowledgeChunk.deleteMany({
            where: { source },
        });
        return result.count;
    }
    async insertChunk(data) {
        const vectorLiteral = client_1.Prisma.raw(`'${data.embeddingVector}'::vector`);
        const metadataLiteral = client_1.Prisma.raw(`'${JSON.stringify(data.metadata)}'::jsonb`);
        const table = client_1.Prisma.raw(this.tbl('knowledge_chunks'));
        await this.prisma.$executeRaw(client_1.Prisma.sql `
        INSERT INTO ${table} ("content", "embedding", "source", "metadata", "updatedAt")
        VALUES (
          ${data.content},
          ${vectorLiteral},
          ${data.source},
          ${metadataLiteral},
          NOW()
        )
      `);
    }
    async findSimilarChunks(embeddingVector, topK, minSimilarity) {
        const vectorLiteral = client_1.Prisma.raw(`'${embeddingVector}'::vector`);
        const minSim = client_1.Prisma.raw(String(minSimilarity));
        const limitRaw = client_1.Prisma.raw(String(topK));
        const table = client_1.Prisma.raw(this.tbl('knowledge_chunks'));
        return this.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT
          id,
          content,
          source,
          1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM ${table}
        WHERE 1 - (embedding <=> ${vectorLiteral}) > ${minSim}
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT ${limitRaw}
      `);
    }
    async getTopKSimilarities(embeddingVector, k) {
        const vectorLiteral = client_1.Prisma.raw(`'${embeddingVector}'::vector`);
        const table = client_1.Prisma.raw(this.tbl('knowledge_chunks'));
        return this.prisma.$queryRaw(client_1.Prisma.sql `
        SELECT id, source, 1 - (embedding <=> ${vectorLiteral}) AS similarity
        FROM ${table}
        ORDER BY embedding <=> ${vectorLiteral}
        LIMIT ${client_1.Prisma.raw(String(k))}
      `);
    }
};
exports.PrismaKnowledgeChunkRepository = PrismaKnowledgeChunkRepository;
exports.PrismaKnowledgeChunkRepository = PrismaKnowledgeChunkRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaKnowledgeChunkRepository);
//# sourceMappingURL=prisma-knowledge-chunk.repository.js.map