import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/services/prisma.service';
import { GlobalExceptionFilter } from '@/http/filters/global-exception.filter';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

describe('Chat (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // Limpar tabelas relevantes
    await prisma.chatLog.deleteMany({});
    await prisma.user.deleteMany({});

    // Criar um usuário de teste
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'chat-e2e@example.com',
        password: 'password123',
        name: 'Chat E2E User',
      });

    authToken = registerResponse.body.data.token;
    userId = registerResponse.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.chatLog.deleteMany({});
    await prisma.user.deleteMany({});
    await app.close();
  });

  describe('/chat/ask (POST)', () => {
    it('should allow asking a question anonymously (without token)', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/ask')
        .send({ question: 'Qual é o horário de atendimento?' })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('answer');

      // Verificar no banco de dados se foi salvo como anônimo (userId null)
      const logs = await prisma.chatLog.findMany({
        where: { question: 'Qual é o horário de atendimento?' },
      });
      expect(logs.length).toBe(1);
      expect(logs[0].userId).toBeNull();
    });

    it('should allow asking a question as an authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/ask')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ question: 'Como faço para renovar um livro?' })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('answer');

      // Verificar no banco de dados se foi associado ao usuário
      const logs = await prisma.chatLog.findMany({
        where: { question: 'Como faço para renovar um livro?' },
      });
      expect(logs.length).toBe(1);
      expect(logs[0].userId).toBe(userId);
    });
  });

  describe('/chat/history (GET)', () => {
    it('should retrieve anonymous history when no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/chat/history')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      // Deve conter apenas as perguntas anônimas
      const anonymousQuestions = response.body.data.map(
        (log: any) => log.question,
      );
      expect(anonymousQuestions).toContain('Qual é o horário de atendimento?');
      expect(anonymousQuestions).not.toContain(
        'Como faço para renovar um livro?',
      );
    });

    it('should retrieve user-scoped history when token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/chat/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      // Deve conter apenas as perguntas do usuário
      const userQuestions = response.body.data.map((log: any) => log.question);
      expect(userQuestions).toContain('Como faço para renovar um livro?');
      expect(userQuestions).not.toContain('Qual é o horário de atendimento?');
    });
  });

  describe('Chat Sessions (e2e)', () => {
    let sessionId: string;

    it('should allow asking a question and automatically create a ChatSession if authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/ask')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ question: 'Quais os contatos da biblioteca?' })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('answer');
      expect(response.body.data).toHaveProperty('sessionId');
      expect(response.body.data.sessionId).toBeDefined();

      sessionId = response.body.data.sessionId;

      // Verificar se a sessão foi realmente criada no DB
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
      expect(session).not.toBeNull();
      expect(session?.title).toBe('Quais os contatos da biblioteca?');
    });

    it('should allow continuing a chat session by providing the sessionId', async () => {
      const response = await request(app.getHttpServer())
        .post('/chat/ask')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          question: 'Qual o telefone deles?',
          sessionId,
        })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.sessionId).toBe(sessionId);

      // Verificar se há dois logs associados à mesma sessão
      const logs = await prisma.chatLog.findMany({
        where: { sessionId },
      });
      expect(logs.length).toBe(2);
    });

    it('should list all sessions for the authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/chat/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data[0].id).toBe(sessionId);
    });

    it('should get details for a specific session', async () => {
      const response = await request(app.getHttpServer())
        .get(`/chat/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.id).toBe(sessionId);
      expect(Array.isArray(response.body.data.chatLogs)).toBe(true);
      expect(response.body.data.chatLogs.length).toBe(2);
    });

    it('should delete a chat session', async () => {
      await request(app.getHttpServer())
        .delete(`/chat/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verificar se a sessão foi excluída do DB
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });
      expect(session).toBeNull();

      // Verificar se os logs da sessão foram excluídos em cascata
      const logs = await prisma.chatLog.findMany({
        where: { sessionId },
      });
      expect(logs.length).toBe(0);
    });

    it('should return 404 when retrieving a deleted or non-existent session', async () => {
      await request(app.getHttpServer())
        .get(`/chat/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
