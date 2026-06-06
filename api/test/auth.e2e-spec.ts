import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/services/prisma.service';
import { GlobalExceptionFilter } from '@/http/filters/global-exception.filter';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'e2e@example.com',
          password: 'password123',
          name: 'E2E User',
        })
        .expect(201);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe('e2e@example.com');
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should fail if email already exists', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'e2e@example.com',
          password: 'password123',
          name: 'Another User',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login and return a JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('e2e@example.com');
    });

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/auth/me (GET) & Route Protection', () => {
    it('should return 401 when accessing protected route without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should access /auth/me when authenticated', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'password123',
        });

      const token = loginResponse.body.data.token;

      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.data.email).toBe('e2e@example.com');
    });
  });
});
