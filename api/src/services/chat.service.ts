import { Injectable } from '@nestjs/common';
import { SearchService } from './search.service';
import { PromptService, ChatMessage } from './prompt.service';
import { PrismaChatLogRepository } from '@/repositories/prisma/prisma-chat-log.repository';
import { PrismaChatSessionRepository } from '@/repositories/prisma/prisma-chat-session.repository';
import { LLMProvider } from '@/providers/ai/LLM/llm.provider';
import { JwtPayload } from '@/types/user.type';
import { ChatSessionNotFoundError } from '@/exeptions';

export interface ChatResponse {
  answer: string;
  sources: { source: string; similarity: number }[];
  avgSimilarity: number;
  chunksUsed: number;
  sessionId?: string;
}

@Injectable()
export class ChatService {
  constructor(
    private search: SearchService,
    private prompt: PromptService,
    private aiProvider: LLMProvider,
    private chatLogRepo: PrismaChatLogRepository,
    private chatSessionRepo: PrismaChatSessionRepository,
  ) {}

  async ask(
    question: string,
    user: JwtPayload | null = null,
    sessionId?: string,
    payloadHistory?: ChatMessage[],
  ): Promise<ChatResponse> {
    console.log(`Pergunta: "${question}"`);

    let resolvedSessionId: string | undefined = sessionId;
    let history: ChatMessage[] = [];

    // 1. Resolver histórico de conversa
    if (user && resolvedSessionId) {
      console.log('Usuario logado e com sessao');
      const session = await this.chatSessionRepo.findById(
        resolvedSessionId,
        Number(user.sub),
      );
      if (session) {
        history = session.chatLogs.flatMap((log) => [
          { role: 'user', content: log.question },
          { role: 'model', content: log.answer },
        ]);
      }
    } else if (!user && payloadHistory) {
      console.log('Usuario deslogado e com historico');
      history = payloadHistory;
    }

    // 2. Se o usuário logado não passou sessionId, cria uma nova sessão
    if (user && !resolvedSessionId) {
      console.log('Usuario logado sem sessao');

      const title =
        question.length > 40 ? question.substring(0, 37) + '...' : question;
      const newSession = await this.chatSessionRepo.create({
        title,
        userId: Number(user.sub),
      });
      resolvedSessionId = newSession.id;
    }

    console.log('historico usado', history);

    // 3. Detecção de intenção: CASUAL vs. DOMAIN
    // Se for mensagem casual (saudações, perguntas genéricas), responde diretamente
    // sem executar o pipeline RAG (sem embedding, sem busca vetorial).
    const intentPrompt = this.prompt.buildIntentClassificationPrompt(question);
    const intentRaw = await this.aiProvider.ask(intentPrompt);
    const intent = intentRaw.trim().toUpperCase();
    console.log(`🧠 Intenção detectada: ${intent}`);

    if (intent === 'CASUAL') {
      console.log('é casual');
      const casualPrompt = this.prompt.buildCasualPrompt(question, history);
      const answer = await this.aiProvider.ask(casualPrompt);
      await this.saveLog(question, answer, [], 0, user, resolvedSessionId);
      return {
        answer,
        sources: [],
        avgSimilarity: 0,
        chunksUsed: 0,
        sessionId: resolvedSessionId,
      };
    }

    console.log('nao é casual');

    // 4. Condensação de query se houver histórico relevante
    let searchQuery = question;
    if (history.length > 0) {
      const condensationPrompt = this.prompt.buildCondensationPrompt(
        history,
        question,
      );
      console.log('prompt gerado', condensationPrompt);
      const condensed = await this.aiProvider.ask(condensationPrompt);
      if (condensed && condensed.trim().length > 0) {
        searchQuery = condensed.trim();
        console.log(`🔍 Query otimizada RAG: "${searchQuery}"`);
      }
    }

    // 4. Busca vetorial: acha os chunks mais relevantes
    const chunks = await this.search.findSimilarChunks(searchQuery);

    console.log('chunks encontrados', chunks);

    // Sem contexto relevante — responde sem chamar o LLM
    if (chunks.length === 0) {
      const answer =
        'Não encontrei informações sobre isso na minha base de dados. Tente reformular a pergunta ou entre em contato com a secretaria.';

      await this.saveLog(question, answer, [], 0, user, resolvedSessionId);

      return {
        answer,
        sources: [],
        avgSimilarity: 0,
        chunksUsed: 0,
        sessionId: resolvedSessionId,
      };
    }

    // 5. Monta o prompt com os chunks como contexto e histórico de mensagens
    const builtPrompt = this.prompt.build(question, chunks, history);

    console.log('PROMPT GERADO', builtPrompt);

    console.log('🤖 Enviando para o LLM...');
    const answer = await this.aiProvider.ask(builtPrompt);

    // Calcula métricas
    const avgSimilarity =
      chunks.reduce((sum, c) => sum + Number(c.similarity), 0) / chunks.length;

    const sources = chunks.map((c) => ({
      source: c.source,
      similarity: Math.round(Number(c.similarity) * 100) / 100,
    }));

    // 6. Salva o log da conversa no banco
    await this.saveLog(
      question,
      answer,
      sources,
      avgSimilarity,
      user,
      resolvedSessionId,
    );

    console.log(
      `✅ Resposta gerada (${chunks.length} chunks, sim. média: ${avgSimilarity.toFixed(2)})`,
    );

    return {
      answer,
      sources,
      avgSimilarity: Math.round(avgSimilarity * 100) / 100,
      chunksUsed: chunks.length,
      sessionId: resolvedSessionId,
    };
  }

  // Histórico de perguntas e respostas avulsas (legado ou sem sessão)
  async getHistory(limit = 20, user: JwtPayload) {
    const userId = Number(user.sub);
    return this.chatLogRepo.findMany(userId, limit);
  }

  // Métodos de gerenciamento de sessões
  async getSessions(userId: number, limit = 20) {
    return this.chatSessionRepo.findMany(userId, limit);
  }

  async getSessionDetails(sessionId: string, userId: number) {
    const session = await this.chatSessionRepo.findById(sessionId, userId);
    if (!session) {
      throw new ChatSessionNotFoundError();
    }
    return session;
  }

  async deleteSession(sessionId: string, userId: number) {
    const result = await this.chatSessionRepo.delete(sessionId, userId);
    if (result.count === 0) {
      throw new ChatSessionNotFoundError();
    }
  }

  private async saveLog(
    question: string,
    answer: string,
    sources: object[],
    similarity: number,
    user: JwtPayload | null,
    sessionId?: string,
  ) {
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
}
//161
