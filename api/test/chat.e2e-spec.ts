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
        .expect(200);

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
        .expect(200);

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
      const anonymousQuestions = response.body.data.map((log: any) => log.question);
      expect(anonymousQuestions).toContain('Qual é o horário de atendimento?');
      expect(anonymousQuestions).not.toContain('Como faço para renovar um livro?');
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
});
