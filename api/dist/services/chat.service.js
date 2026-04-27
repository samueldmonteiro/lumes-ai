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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./search.service");
const prompt_service_1 = require("./prompt.service");
const prisma_1 = require("../lib/prisma");
const ai_provider_1 = require("../ai/providers/ai.provider");
let ChatService = ChatService_1 = class ChatService {
    search;
    prompt;
    aiProvider;
    logger = new common_1.Logger(ChatService_1.name);
    constructor(search, prompt, aiProvider) {
        this.search = search;
        this.prompt = prompt;
        this.aiProvider = aiProvider;
    }
    async ask(question) {
        this.logger.log(`💬 Pergunta: "${question}"`);
        const chunks = await this.search.findSimilarChunks(question);
        if (chunks.length === 0) {
            const answer = 'Não encontrei informações sobre isso na minha base de dados. Tente reformular a pergunta ou entre em contato com a secretaria.';
            await this.saveLog(question, answer, [], 0);
            return { answer, sources: [], avgSimilarity: 0, chunksUsed: 0 };
        }
        const builtPrompt = this.prompt.build(question, chunks);
        console.log('PROMPT', builtPrompt);
        this.logger.log('🤖 Enviando para o LLM...');
        const answer = await this.aiProvider.ask(builtPrompt);
        const avgSimilarity = chunks.reduce((sum, c) => sum + Number(c.similarity), 0) / chunks.length;
        const sources = chunks.map(c => ({
            category: c.category,
            source: c.source,
            similarity: Math.round(Number(c.similarity) * 100) / 100,
        }));
        await this.saveLog(question, answer, sources, avgSimilarity);
        this.logger.log(`✅ Resposta gerada (${chunks.length} chunks, sim. média: ${avgSimilarity.toFixed(2)})`);
        return {
            answer,
            sources,
            avgSimilarity: Math.round(avgSimilarity * 100) / 100,
            chunksUsed: chunks.length,
        };
    }
    async getHistory(limit = 20) {
        return prisma_1.prisma.chatLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                question: true,
                answer: true,
                similarity: true,
                createdAt: true,
            },
        });
    }
    async saveLog(question, answer, sources, similarity) {
        await prisma_1.prisma.chatLog.create({
            data: { question, answer, sources, similarity },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [search_service_1.SearchService,
        prompt_service_1.PromptService,
        ai_provider_1.AIProvider])
], ChatService);
//# sourceMappingURL=chat.service.js.map