import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/services/prisma.service';
import { IngestService } from '@/services/ingest.service';
import { GlobalExceptionFilter } from '@/http/filters/global-exception.filter';
import { UserRole } from '@/generated/prisma/client';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

describe('Ingest Controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockIngestService = {
    ingestText: () =>
      Promise.resolve({
        ok: true,
        source: 'manual',
        category: 'geral',
        chunksProcessed: 1,
        chunksSaved: 1,
      }),
  };

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
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await app.close();
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    await request(app.getHttpServer())
      .post('/ingests/text')
      .send({
        text: 'some knowledge content',
        source: 'manual',
        category: 'geral',
      })
      .expect(401);
  });

  it('should return 403 Forbidden if user is not an ADMIN', async () => {
    // 1. Create a regular user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user-ingest@example.com',
        password: 'password123',
        name: 'Regular User',
      })
      .expect(201);

    const token = registerResponse.body.data.token;

    // 2. Try to access ingest route
    const response = await request(app.getHttpServer())
      .post('/ingests/text')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'some knowledge content',
        source: 'manual',
        category: 'geral',
      })
      .expect(403);

    expect(response.body.ok).toBe(false);
    expect(response.body.message).toContain('Acesso negado: permissões insuficientes');
  });

  it('should allow ingestion if user is an ADMIN', async () => {
    // 1. Create another user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin-ingest@example.com',
        password: 'password123',
        name: 'Admin User',
      })
      .expect(201);

    const token = registerResponse.body.data.token;

    // 2. Promote user to ADMIN directly in the database
    await prisma.user.update({
      where: { email: 'admin-ingest@example.com' },
      data: { role: UserRole.ADMIN },
    });

    // 3. Login again to get a fresh token containing the new role
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin-ingest@example.com',
        password: 'password123',
      })
      .expect(200);

    const adminToken = loginResponse.body.data.token;

    // 4. Try to access ingest route with admin token
    const response = await request(app.getHttpServer())
      .post('/ingests/text')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        text: 'some knowledge content',
        source: 'manual',
        category: 'geral',
      })
      .expect(201);

    expect(response.body.ok).toBe(true);
    expect(response.body.chunksProcessed).toBe(1);
  });
});
