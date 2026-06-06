import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { ChatService } from '@/services/chat.service';
import { GlobalExceptionFilter } from '@/http/filters/global-exception.filter';
import { describe, beforeAll, afterAll, it, expect, vi } from 'vitest';

const mockChatService = {
  ask: vi.fn(),
  getHistory: vi.fn(),
  getSessions: vi.fn(),
  getSessionDetails: vi.fn(),
  deleteSession: vi.fn(),
};

describe('Chat (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ChatService)
      .useValue(mockChatService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'chat-e2e@example.com',
        password: 'password123',
        name: 'Chat E2E User',
      });

    authToken = registerResponse.body.data.token;
  });

  afterAll(async () => {
    vi.clearAllMocks();
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /chat/ask', () => {
    it('should return 201 and call ChatService.ask (anonymous)', async () => {
      const mockResponse = {
        answer: 'Resposta de teste',
        sources: [],
        avgSimilarity: 0,
        chunksUsed: 0,
      };
      mockChatService.ask.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/chat/ask')
        .send({ question: 'Qual o horário de atendimento?' })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.answer).toBe('Resposta de teste');
      expect(mockChatService.ask).toHaveBeenCalledWith(
        'Qual o horário de atendimento?',
        null,
        undefined,
        undefined,
      );
    });

    it('should return 201 and call ChatService.ask (authenticated)', async () => {
      const mockResponse = {
        answer: 'Resposta autenticada',
        sources: [],
        avgSimilarity: 0,
        chunksUsed: 0,
        sessionId: 'session-uuid',
      };
      mockChatService.ask.mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/chat/ask')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ question: 'Como renovar um livro?' })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.sessionId).toBe('session-uuid');
    });

    it('should return 400 when question is too short', async () => {
      await request(app.getHttpServer())
        .post('/chat/ask')
        .send({ question: 'ab' })
        .expect(400);
    });

    it('should return 400 when question is missing', async () => {
      await request(app.getHttpServer()).post('/chat/ask').send({}).expect(400);
    });
  });

  describe('GET /chat/history', () => {
    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/chat/history').expect(401);
    });

    it('should return 200 and call ChatService.getHistory', async () => {
      const mockHistory = [
        {
          id: 1,
          question: 'Pergunta 1',
          answer: 'Resposta 1',
          similarity: 0.9,
          createdAt: new Date(),
        },
      ];
      mockChatService.getHistory.mockResolvedValue(mockHistory);

      const response = await request(app.getHttpServer())
        .get('/chat/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(mockChatService.getHistory).toHaveBeenCalled();
    });
  });

  describe('GET /chat/sessions', () => {
    it('should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/chat/sessions').expect(401);
    });

    it('should return 200 and list sessions', async () => {
      const mockSessions = [
        {
          id: 'session-1',
          title: 'Sessão 1',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockChatService.getSessions.mockResolvedValue(mockSessions);

      const response = await request(app.getHttpServer())
        .get('/chat/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /chat/sessions/:id', () => {
    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/chat/sessions/some-id')
        .expect(401);
    });

    it('should return 200 and session details', async () => {
      const mockSession = {
        id: 'session-1',
        title: 'Sessão 1',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatLogs: [],
      };
      mockChatService.getSessionDetails.mockResolvedValue(mockSession);

      const response = await request(app.getHttpServer())
        .get('/chat/sessions/session-1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.id).toBe('session-1');
    });

    it('should return 404 when session not found', async () => {
      mockChatService.getSessionDetails.mockRejectedValue(
        new NotFoundException('Sessão de chat não encontrada.'),
      );

      const response = await request(app.getHttpServer())
        .get('/chat/sessions/non-existent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.ok).toBe(false);
    });
  });

  describe('DELETE /chat/sessions/:id', () => {
    it('should return 401 without token', async () => {
      await request(app.getHttpServer())
        .delete('/chat/sessions/some-id')
        .expect(401);
    });

    it('should return 200 on successful deletion', async () => {
      mockChatService.deleteSession.mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete('/chat/sessions/session-1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return 404 when session not found', async () => {
      mockChatService.deleteSession.mockRejectedValue(
        new NotFoundException('Sessão de chat não encontrada.'),
      );

      const response = await request(app.getHttpServer())
        .delete('/chat/sessions/non-existent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.ok).toBe(false);
    });
  });
});
