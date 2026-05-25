import { Injectable, Logger } from '@nestjs/common';
import { SearchService } from './search.service';
import { PromptService } from './prompt.service';
import { PrismaService } from './prisma.service';
import { LLMProvider } from '@/providers/ai/LLM/llm.provider';
import { JwtPayload } from '@/types/user.type';

export interface ChatResponse {
  answer: string;
  sources: { category: string; source: string; similarity: number }[];
  avgSimilarity: number;
  chunksUsed: number;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private search: SearchService,
    private prompt: PromptService,
    private aiProvider: LLMProvider,
    private prismaService: PrismaService,
  ) { }

  async ask(question: string, user: JwtPayload | null = null): Promise<ChatResponse> {
    this.logger.log(`💬 Pergunta: "${question}"`);

    // PASSO 1 — Busca vetorial: acha os chunks mais relevantes
    const chunks = await this.search.findSimilarChunks(question);

    // Sem contexto relevante — responde sem chamar o LLM
    if (chunks.length === 0) {
      const answer = 'Não encontrei informações sobre isso na minha base de dados. Tente reformular a pergunta ou entre em contato com a secretaria.';

      await this.saveLog(question, answer, [], 0, user);

      return { answer, sources: [], avgSimilarity: 0, chunksUsed: 0 };
    }

    // PASSO 2 — Monta o prompt com os chunks como contexto
    const builtPrompt = this.prompt.build(question, chunks);
    console.log('PROMPT', builtPrompt);

    this.logger.log('🤖 Enviando para o LLM...');
    const answer = await this.aiProvider.ask(builtPrompt);

    // Calcula métricas
    const avgSimilarity =
      chunks.reduce((sum, c) => sum + Number(c.similarity), 0) / chunks.length;

    const sources = chunks.map(c => ({
      category: c.category,
      source: c.source,
      similarity: Math.round(Number(c.similarity) * 100) / 100,
    }));

    // PASSO 4 — Salva o log da conversa no banco
    await this.saveLog(question, answer, sources, avgSimilarity, user);

    this.logger.log(`✅ Resposta gerada (${chunks.length} chunks, sim. média: ${avgSimilarity.toFixed(2)})`);

    return {
      answer,
      sources,
      avgSimilarity: Math.round(avgSimilarity * 100) / 100,
      chunksUsed: chunks.length,
    };
  }

  // Histórico de perguntas e respostas
  async getHistory(limit = 20, user: JwtPayload | null = null) {
    const userId = user ? Number(user.sub) : null;
    return this.prismaService.chatLog.findMany({
      where: { userId },
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

  private async saveLog(
    question: string,
    answer: string,
    sources: object[],
    similarity: number,
    user: JwtPayload | null,
  ) {
    const userId = user ? Number(user.sub) : null;
    await this.prismaService.chatLog.create({
      data: { question, answer, sources, similarity, userId },
    });
  }
}