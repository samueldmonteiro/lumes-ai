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
const prisma_chat_log_repository_1 = require("../repositories/prisma/prisma-chat-log.repository");
const prisma_chat_session_repository_1 = require("../repositories/prisma/prisma-chat-session.repository");
const llm_provider_1 = require("../providers/ai/LLM/llm.provider");
const exeptions_1 = require("../exeptions");
let ChatService = ChatService_1 = class ChatService {
    search;
    prompt;
    aiProvider;
    chatLogRepo;
    chatSessionRepo;
    logger = new common_1.Logger(ChatService_1.name);
    constructor(search, prompt, aiProvider, chatLogRepo, chatSessionRepo) {
        this.search = search;
        this.prompt = prompt;
        this.aiProvider = aiProvider;
        this.chatLogRepo = chatLogRepo;
        this.chatSessionRepo = chatSessionRepo;
    }
    async ask(question, user = null, sessionId, payloadHistory) {
        this.logger.log(`💬 Pergunta: "${question}"`);
        let resolvedSessionId = sessionId;
        let history = [];
        if (user && resolvedSessionId) {
            const session = await this.chatSessionRepo.findById(resolvedSessionId, Number(user.sub));
            if (session) {
                history = session.chatLogs.flatMap((log) => [
                    { role: 'user', content: log.question },
                    { role: 'model', content: log.answer },
                ]);
            }
        }
        else if (!user && payloadHistory) {
            history = payloadHistory;
        }
        if (user && !resolvedSessionId) {
            const title = question.length > 40 ? question.substring(0, 37) + '...' : question;
            const newSession = await this.chatSessionRepo.create({
                title,
                userId: Number(user.sub),
            });
            resolvedSessionId = newSession.id;
        }
        let searchQuery = question;
        if (history.length > 0) {
            const condensationPrompt = this.prompt.buildCondensationPrompt(history, question);
            const condensed = await this.aiProvider.ask(condensationPrompt);
            if (condensed && condensed.trim().length > 0) {
                searchQuery = condensed.trim();
                this.logger.log(`🔍 Query otimizada RAG: "${searchQuery}"`);
            }
        }
        const chunks = await this.search.findSimilarChunks(searchQuery);
        if (chunks.length === 0) {
            const answer = 'Não encontrei informações sobre isso na minha base de dados. Tente reformular a pergunta ou entre em contato com a secretaria.';
            await this.saveLog(question, answer, [], 0, user, resolvedSessionId);
            return { answer, sources: [], avgSimilarity: 0, chunksUsed: 0, sessionId: resolvedSessionId };
        }
        const builtPrompt = this.prompt.build(question, chunks, history);
        this.logger.log('🤖 Enviando para o LLM...');
        const answer = await this.aiProvider.ask(builtPrompt);
        const avgSimilarity = chunks.reduce((sum, c) => sum + Number(c.similarity), 0) / chunks.length;
        const sources = chunks.map((c) => ({
            category: c.category,
            source: c.source,
            similarity: Math.round(Number(c.similarity) * 100) / 100,
        }));
        await this.saveLog(question, answer, sources, avgSimilarity, user, resolvedSessionId);
        this.logger.log(`✅ Resposta gerada (${chunks.length} chunks, sim. média: ${avgSimilarity.toFixed(2)})`);
        return {
            answer,
            sources,
            avgSimilarity: Math.round(avgSimilarity * 100) / 100,
            chunksUsed: chunks.length,
            sessionId: resolvedSessionId,
        };
    }
    async getHistory(limit = 20, user = null) {
        const userId = user ? Number(user.sub) : null;
        return this.chatLogRepo.findMany(userId, limit);
    }
    async getSessions(userId, limit = 20) {
        return this.chatSessionRepo.findMany(userId, limit);
    }
    async getSessionDetails(sessionId, userId) {
        const session = await this.chatSessionRepo.findById(sessionId, userId);
        if (!session) {
            throw new exeptions_1.ChatSessionNotFoundError();
        }
        return session;
    }
    async deleteSession(sessionId, userId) {
        const result = await this.chatSessionRepo.delete(sessionId, userId);
        if (result.count === 0) {
            throw new exeptions_1.ChatSessionNotFoundError();
        }
    }
    async saveLog(question, answer, sources, similarity, user, sessionId) {
        const userId = user ? Number(user.sub) : null;
        await this.chatLogRepo.create({
            question,
            answer,
            sources,
            similarity,
            userId,
            sessionId,
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [search_service_1.SearchService,
        prompt_service_1.PromptService,
        llm_provider_1.LLMProvider,
        prisma_chat_log_repository_1.PrismaChatLogRepository,
        prisma_chat_session_repository_1.PrismaChatSessionRepository])
], ChatService);
//# sourceMappingURL=chat.service.js.map