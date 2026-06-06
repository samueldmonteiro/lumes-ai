import { Test, TestingModule } from '@nestjs/testing';
import {
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  it,
  expect,
  vi,
} from 'vitest';
import { ChatService } from '@/services/chat.service';
import { SearchService, SearchResult } from '@/services/search.service';
import { PromptService } from '@/services/prompt.service';
import { PrismaService } from '@/services/prisma.service';
import { PrismaChatLogRepository } from '@/repositories/prisma/prisma-chat-log.repository';
import { PrismaChatSessionRepository } from '@/repositories/prisma/prisma-chat-session.repository';
import { LLMProvider } from '@/providers/ai/LLM/llm.provider';
import { JwtPayload } from '@/types/user.type';
import { UserRole } from '@/generated/prisma/client';

const fakeChunks: SearchResult[] = [
  {
    id: 1,
    content: 'A biblioteca funciona de segunda a sexta, das 8h às 18h.',
    source: 'manual',
    similarity: 0.92,
  },
  {
    id: 2,
    content: 'Para renovar um livro, acesse o portal do aluno.',
    source: 'manual',
    similarity: 0.85,
  },
];

const baseUserPayload: Omit<JwtPayload, 'sub'> = {
  email: 'chat-int@example.com',
  role: UserRole.USER,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86400,
};

describe('ChatService (integration)', () => {
  let module: TestingModule;
  let chatService: ChatService;
  let prisma: PrismaService;
  let llmProvider: LLMProvider;
  let searchService: SearchService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        PrismaService,
        PrismaChatLogRepository,
        PrismaChatSessionRepository,
        PromptService,
        ChatService,
        {
          provide: SearchService,
          useValue: {
            findSimilarChunks: vi.fn().mockResolvedValue(fakeChunks),
          },
        },
        {
          provide: LLMProvider,
          useValue: {
            ask: vi.fn(),
          },
        },
      ],
    }).compile();

    chatService = module.get(ChatService);
    prisma = module.get(PrismaService);
    llmProvider = module.get(LLMProvider);
    searchService = module.get(SearchService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await prisma.chatLog.deleteMany({});
    await prisma.chatSession.deleteMany({});
    await prisma.user.deleteMany({});
    vi.resetAllMocks();
  });

  describe('ask()', () => {
    it('should answer anonymously (no user, DOMAIN intent)', async () => {
      vi.mocked(llmProvider.ask)
        .mockResolvedValueOnce('DOMAIN')
        .mockResolvedValueOnce(
          'A biblioteca funciona de segunda a sexta, das 8h às 18h.',
        );

      vi.mocked(searchService.findSimilarChunks).mockResolvedValue(fakeChunks);

      const result = await chatService.ask('Qual o horário da biblioteca?');

      expect(result.answer).toBe(
        'A biblioteca funciona de segunda a sexta, das 8h às 18h.',
      );
      expect(result.sources).toHaveLength(2);
      expect(result.chunksUsed).toBe(2);
      expect(result.avgSimilarity).toBeGreaterThan(0);
      expect(result.sessionId).toBeUndefined();

      const logs = await prisma.chatLog.findMany();
      expect(logs).toHaveLength(1);
      expect(logs[0].userId).toBeNull();
    });

    it('should handle CASUAL intent without RAG', async () => {
      vi.mocked(llmProvider.ask)
        .mockResolvedValueOnce('CASUAL')
        .mockResolvedValueOnce('Olá! Como posso ajudar você hoje?');

      const result = await chatService.ask('Olá, tudo bem?');

      expect(result.answer).toBe('Olá! Como posso ajudar você hoje?');
      expect(result.chunksUsed).toBe(0);
      expect(result.sources).toHaveLength(0);

      const logs = await prisma.chatLog.findMany();
      expect(logs).toHaveLength(1);
    });

    it('should create a session for authenticated user without sessionId', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'session-create@example.com',
          password: 'hash',
          name: 'Session Create',
        },
      });
      const userPayload: JwtPayload = {
        ...baseUserPayload,
        sub: String(user.id),
      };

      vi.mocked(llmProvider.ask)
        .mockResolvedValueOnce('DOMAIN')
        .mockResolvedValueOnce('O telefone da secretaria é (11) 1234-5678.');

      vi.mocked(searchService.findSimilarChunks).mockResolvedValue(fakeChunks);

      const result = await chatService.ask(
        'Qual o telefone da secretaria?',
        userPayload,
      );

      expect(result.sessionId).toBeDefined();
      expect(result.answer).toBe('O telefone da secretaria é (11) 1234-5678.');

      const session = await prisma.chatSession.findUnique({
        where: { id: result.sessionId },
      });
      expect(session).not.toBeNull();
      expect(session?.title).toBe('Qual o telefone da secretaria?');
      expect(session?.userId).toBe(user.id);

      const logs = await prisma.chatLog.findMany({
        where: { sessionId: result.sessionId },
      });
      expect(logs).toHaveLength(1);
      expect(logs[0].userId).toBe(user.id);
    });

    it('should continue an existing session when sessionId is provided', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'session-continue@example.com',
          password: 'hash',
          name: 'Session Continue',
        },
      });
      const userPayload: JwtPayload = {
        ...baseUserPayload,
        sub: String(user.id),
      };

      vi.mocked(llmProvider.ask)
        .mockResolvedValueOnce('DOMAIN')
        .mockResolvedValueOnce('Resposta da primeira pergunta.');
      vi.mocked(searchService.findSimilarChunks).mockResolvedValue(fakeChunks);

      const first = await chatService.ask('Primeira pergunta?', userPayload);

      vi.mocked(llmProvider.ask)
        .mockResolvedValueOnce('DOMAIN')
        .mockResolvedValueOnce('Segunda pergunta no contexto da primeira?')
        .mockResolvedValueOnce('Resposta da segunda pergunta.');
      vi.mocked(searchService.findSimilarChunks).mockResolvedValue(fakeChunks);

      const second = await chatService.ask(
        'Segunda pergunta?',
        userPayload,
        first.sessionId,
      );

      expect(second.sessionId).toBe(first.sessionId);

      const logs = await prisma.chatLog.findMany({
        where: { sessionId: first.sessionId },
        orderBy: { createdAt: 'asc' },
      });
      expect(logs).toHaveLength(2);
    });

    it('should return fallback answer when no chunks are found', async () => {
      vi.mocked(llmProvider.ask).mockResolvedValueOnce('DOMAIN');
      vi.mocked(searchService.findSimilarChunks).mockResolvedValue([]);

      const result = await chatService.ask('Pergunta sem contexto na base?');

      expect(result.answer).toBe(
        'Não encontrei informações sobre isso na minha base de dados. Tente reformular a pergunta ou entre em contato com a secretaria.',
      );
      expect(result.chunksUsed).toBe(0);
    });

    it('should use payload history for anonymous user', async () => {
      vi.mocked(llmProvider.ask)
        .mockResolvedValueOnce('DOMAIN')
        .mockResolvedValueOnce('query condensada')
        .mockResolvedValueOnce('Resposta com histórico.');

      vi.mocked(searchService.findSimilarChunks).mockResolvedValue(fakeChunks);

      const result = await chatService.ask('E qual o valor?', null, undefined, [
        { role: 'user', content: 'Qual o preço do curso?' },
        { role: 'model', content: 'O curso custa R$ 500.' },
      ]);

      expect(result.answer).toBe('Resposta com histórico.');
    });
  });

  describe('getHistory()', () => {
    it('should return chat logs for the user ordered by newest first', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'history-user@example.com',
          password: 'hash',
          name: 'History User',
        },
      });

      await prisma.chatLog.create({
        data: {
          question: 'Pergunta 1',
          answer: 'Resposta 1',
          similarity: 0.9,
          userId: user.id,
          createdAt: new Date('2026-01-01'),
        },
      });
      await prisma.chatLog.create({
        data: {
          question: 'Pergunta 2',
          answer: 'Resposta 2',
          similarity: 0.8,
          userId: user.id,
          createdAt: new Date('2026-06-01'),
        },
      });

      const payload: JwtPayload = { ...baseUserPayload, sub: String(user.id) };

      const history = await chatService.getHistory(10, payload);

      expect(history).toHaveLength(2);
      expect(history[0].question).toBe('Pergunta 2');
    });

    it('should respect the limit parameter', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'limit-user@example.com',
          password: 'hash',
          name: 'Limit User',
        },
      });

      await prisma.chatLog.createMany({
        data: [
          { question: 'Q1', answer: 'A1', similarity: 0.5, userId: user.id },
          { question: 'Q2', answer: 'A2', similarity: 0.5, userId: user.id },
          { question: 'Q3', answer: 'A3', similarity: 0.5, userId: user.id },
        ],
      });

      const payload: JwtPayload = { ...baseUserPayload, sub: String(user.id) };

      const history = await chatService.getHistory(2, payload);
      expect(history).toHaveLength(2);
    });
  });

  describe('getSessions()', () => {
    it('should return sessions for the user ordered by updatedAt desc', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'session-user@example.com',
          password: 'hash',
          name: 'Session User',
        },
      });

      await prisma.chatSession.createMany({
        data: [
          { title: 'Sessão A', userId: user.id },
          { title: 'Sessão B', userId: user.id },
        ],
      });

      const sessions = await chatService.getSessions(user.id, 10);

      expect(sessions).toHaveLength(2);
    });

    it('should return empty array when user has no sessions', async () => {
      const sessions = await chatService.getSessions(999, 10);
      expect(sessions).toHaveLength(0);
    });
  });

  describe('getSessionDetails()', () => {
    it('should return session with chat logs', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'detail-user@example.com',
          password: 'hash',
          name: 'Detail User',
        },
      });

      const session = await prisma.chatSession.create({
        data: { title: 'Sessão Detalhes', userId: user.id },
      });

      await prisma.chatLog.createMany({
        data: [
          {
            question: 'Q1',
            answer: 'A1',
            similarity: 0.9,
            userId: user.id,
            sessionId: session.id,
          },
          {
            question: 'Q2',
            answer: 'A2',
            similarity: 0.8,
            userId: user.id,
            sessionId: session.id,
          },
        ],
      });

      const details = await chatService.getSessionDetails(session.id, user.id);

      expect(details.id).toBe(session.id);
      expect(details.chatLogs).toHaveLength(2);
    });

    it('should throw ChatSessionNotFoundError for non-existent session', async () => {
      await expect(
        chatService.getSessionDetails('non-existent-id', 1),
      ).rejects.toThrow('Sessão de chat não encontrada.');
    });
  });

  describe('deleteSession()', () => {
    it('should delete session and cascade chat logs', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'delete-user@example.com',
          password: 'hash',
          name: 'Delete User',
        },
      });

      const session = await prisma.chatSession.create({
        data: { title: 'Sessão para deletar', userId: user.id },
      });

      await prisma.chatLog.create({
        data: {
          question: 'Q',
          answer: 'A',
          similarity: 0.5,
          userId: user.id,
          sessionId: session.id,
        },
      });

      await chatService.deleteSession(session.id, user.id);

      const deletedSession = await prisma.chatSession.findUnique({
        where: { id: session.id },
      });
      expect(deletedSession).toBeNull();

      const logs = await prisma.chatLog.findMany({
        where: { sessionId: session.id },
      });
      expect(logs).toHaveLength(0);
    });

    it('should throw ChatSessionNotFoundError when session does not exist', async () => {
      await expect(
        chatService.deleteSession('non-existent', 1),
      ).rejects.toThrow('Sessão de chat não encontrada.');
    });

    it('should throw ChatSessionNotFoundError when session belongs to another user', async () => {
      const userA = await prisma.user.create({
        data: { email: 'owner@example.com', password: 'hash', name: 'Owner' },
      });
      const userB = await prisma.user.create({
        data: {
          email: 'intruder@example.com',
          password: 'hash',
          name: 'Intruder',
        },
      });

      const session = await prisma.chatSession.create({
        data: { title: 'Sessão do userA', userId: userA.id },
      });

      await expect(
        chatService.deleteSession(session.id, userB.id),
      ).rejects.toThrow('Sessão de chat não encontrada.');
    });
  });
});
