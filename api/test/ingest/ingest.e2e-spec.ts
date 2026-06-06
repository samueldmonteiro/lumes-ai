/**
 * Testes E2E do IngestController.
 *
 * O IngestService é substituído por um mock para isolar a camada HTTP dos
 * providers externos (Ollama/Gemini). Os testes cobrem:
 *  - Autenticação e autorização (401 / 403)
 *  - POST /ingests/text  — ingestão de texto plano
 *  - POST /ingests/json  — ingestão de objeto JSON
 *  - POST /ingests/pdf   — ingestão de arquivo PDF (multipart/form-data)
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/services/prisma.service';
import { IngestService } from '@/services/ingest.service';
import { GlobalExceptionFilter } from '@/http/filters/global-exception.filter';
import { UserRole } from '@/generated/prisma/client';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

// ─── Mock do IngestService ────────────────────────────────────────────────────

const mockIngestService = {
  ingestText: (_text: string, source: string) =>
    Promise.resolve({ ok: true, source, chunksProcessed: 2, chunksSaved: 2 }),

  ingestPDF: (_buffer: Buffer, source: string) =>
    Promise.resolve({ ok: true, source, chunksProcessed: 3, chunksSaved: 3 }),

  ingestJSON: (_data: Record<string, unknown>, source: string) =>
    Promise.resolve({ ok: true, source, chunksProcessed: 1, chunksSaved: 1 }),
};

// ─── Suite ───────────────────────────────────────────────────────────────────

describe('IngestController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IngestService)
      .useValue(mockIngestService)
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

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    // ── Cria usuário comum ────────────────────────────────────────────────────
    const userRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user-ingest@example.com',
        password: 'password123',
        name: 'Regular User',
      })
      .expect(201);

    userToken = userRegister.body.data.token;

    // ── Cria usuário admin ────────────────────────────────────────────────────
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin-ingest@example.com',
        password: 'password123',
        name: 'Admin User',
      })
      .expect(201);

    await prisma.user.update({
      where: { email: 'admin-ingest@example.com' },
      data: { role: UserRole.ADMIN },
    });

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin-ingest@example.com', password: 'password123' })
      .expect(200);

    adminToken = adminLogin.body.data.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await app.close();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // POST /ingests/text
  // ══════════════════════════════════════════════════════════════════════════

  describe('POST /ingests/text', () => {
    it('deve retornar 401 sem token', async () => {
      await request(app.getHttpServer())
        .post('/ingests/text')
        .send({ text: 'conteúdo de teste para ingestão', source: 'manual' })
        .expect(401);
    });

    it('deve retornar 403 para usuário sem role ADMIN', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingests/text')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'conteúdo de teste para ingestão', source: 'manual' })
        .expect(403);

      expect(response.body.ok).toBe(false);
      expect(response.body.message).toContain('Acesso negado');
    });

    it('deve retornar 400 quando text for muito curto (< 10 chars)', async () => {
      await request(app.getHttpServer())
        .post('/ingests/text')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ text: 'curto' })
        .expect(400);
    });

    it('deve retornar 400 quando text não for enviado', async () => {
      await request(app.getHttpServer())
        .post('/ingests/text')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ source: 'manual' })
        .expect(400);
    });

    it('deve ingerir texto com sucesso (admin)', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingests/text')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          text: 'Conteúdo de conhecimento suficientemente longo para o teste.',
          source: 'e2e-text',
        })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.source).toBe('e2e-text');
      expect(response.body.data.chunksSaved).toBe(2);
    });

    it('deve gerar source automático quando não informado', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingests/text')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          text: 'Texto sem source explícita para testar UUID automático.',
        })
        .expect(201);

      expect(response.body.data.source).toMatch(/^manual-/);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // POST /ingests/json
  // ══════════════════════════════════════════════════════════════════════════

  describe('POST /ingests/json', () => {
    it('deve retornar 401 sem token', async () => {
      await request(app.getHttpServer())
        .post('/ingests/json')
        .send({ data: { chave: 'valor' } })
        .expect(401);
    });

    it('deve retornar 403 para usuário sem role ADMIN', async () => {
      await request(app.getHttpServer())
        .post('/ingests/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ data: { chave: 'valor' } })
        .expect(403);
    });

    it('deve retornar 400 quando data for uma string (não objeto)', async () => {
      await request(app.getHttpServer())
        .post('/ingests/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ data: 'isso é uma string, não objeto' })
        .expect(400);
    });

    it('deve retornar 400 quando data não for enviado', async () => {
      await request(app.getHttpServer())
        .post('/ingests/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ source: 'sem-data' })
        .expect(400);
    });

    it('deve ingerir JSON com sucesso (admin)', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingests/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          data: { sistema: 'Lumes AI', versao: '2.0', ativo: true },
          source: 'e2e-json',
        })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.source).toBe('e2e-json');
      expect(response.body.data.chunksSaved).toBe(1);
    });

    it('deve gerar source automático quando não informado', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingests/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ data: { k: 'v' } })
        .expect(201);

      expect(response.body.data.source).toMatch(/^json-/);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // POST /ingests/pdf
  // ══════════════════════════════════════════════════════════════════════════

  describe('POST /ingests/pdf', () => {
    it('deve retornar 401 sem token', async () => {
      await request(app.getHttpServer())
        .post('/ingests/pdf')
        .attach('file', Buffer.from('%PDF-1.4 fake'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        })
        .expect(401);
    });

    it('deve retornar 403 para usuário sem role ADMIN', async () => {
      await request(app.getHttpServer())
        .post('/ingests/pdf')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('file', Buffer.from('%PDF-1.4 fake'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        })
        .expect(403);
    });

    it('deve retornar 400 quando nenhum arquivo é enviado', async () => {
      await request(app.getHttpServer())
        .post('/ingests/pdf')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });

    it('deve retornar 400 para arquivo com mimetype incorreto', async () => {
      await request(app.getHttpServer())
        .post('/ingests/pdf')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('file', Buffer.from('conteúdo de texto plano'), {
          filename: 'doc.txt',
          contentType: 'text/plain',
        })
        .expect(400);
    });

    it('deve ingerir PDF com sucesso (admin)', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingests/pdf')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('source', 'e2e-pdf')
        .attach('file', Buffer.from('%PDF-1.4 simulated'), {
          filename: 'documento.pdf',
          contentType: 'application/pdf',
        })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.source).toBe('e2e-pdf');
      expect(response.body.data.chunksSaved).toBe(3);
    });

    it('deve gerar source automático quando não informado', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingests/pdf')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('file', Buffer.from('%PDF-1.4 simulated'), {
          filename: 'sem-source.pdf',
          contentType: 'application/pdf',
        })
        .expect(201);

      expect(response.body.data.source).toMatch(/^pdf-/);
    });
  });
});
