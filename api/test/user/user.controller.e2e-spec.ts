import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/services/prisma.service';
import { GlobalExceptionFilter } from '@/http/filters/global-exception.filter';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

describe('UserController (e2e) — PATCH /users/me', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  // We'll reuse a single user across all tests; each test operates on it.
  let userId: number;
  let token: string;

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

  // ── Helpers ───────────────────────────────────────────────────────────────

  async function registerUser(email: string, password: string, name: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name })
      .expect(201);

    return {
      token: res.body.data.token as string,
      userId: res.body.data.user.id as number,
    };
  }

  // ── Setup ─────────────────────────────────────────────────────────────────

  beforeAll(async () => {
    // Register the primary test user
    const result = await (async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'patch-me@example.com',
          password: 'senha123',
          name: 'Original Name',
        });
      return {
        token: res.body.data.token as string,
        userId: res.body.data.user.id as number,
      };
    })();

    token = result.token;
    userId = result.userId;
  });

  // ── Auth protection ───────────────────────────────────────────────────────

  it('should return 401 when no token is provided', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .send({ name: 'No Auth' })
      .expect(401);
  });

  it('should return 401 with an invalid token', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', 'Bearer invalid.token.here')
      .send({ name: 'Bad Token' })
      .expect(401);
  });

  // ── Validation ────────────────────────────────────────────────────────────

  it('should return 400 when email is malformed', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'not-an-email' })
      .expect(400);
  });

  it('should return 400 when password is too short', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: '123' })
      .expect(400);
  });

  it('should return 400 when unknown fields are sent', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ unknownField: 'value' })
      .expect(400);
  });

  // ── Happy paths ───────────────────────────────────────────────────────────

  it('should update name successfully', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' })
      .expect(200);

    expect(response.body.ok).toBe(true);
    expect(response.body.data.name).toBe('Updated Name');
    expect(response.body.data).not.toHaveProperty('password');
  });

  it('should update email successfully', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'updated-email@example.com' })
      .expect(200);

    expect(response.body.ok).toBe(true);
    expect(response.body.data.email).toBe('updated-email@example.com');
  });

  it('should update password and allow login with new password', async () => {
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'novaSenha789' })
      .expect(200);

    // Fetch current email for the user (may have been changed in previous tests)
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user!.email, password: 'novaSenha789' })
      .expect(200);

    expect(loginResponse.body.ok).toBe(true);
    expect(loginResponse.body.data).toHaveProperty('token');
  });

  // ── Email conflict ────────────────────────────────────────────────────────

  it('should return 409 when the new email is already in use', async () => {
    // Register a second user to occupy an email
    await registerUser(
      'conflict@example.com',
      'senhaConflict',
      'Conflict User',
    );

    // Try to change primary user to conflict email
    await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'conflict@example.com' })
      .expect(409);

    // Clean up second user
    await prisma.user.deleteMany({ where: { email: 'conflict@example.com' } });
  });

  // ── Response shape ────────────────────────────────────────────────────────

  it('should return the correct response shape', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Shape Test' })
      .expect(200);

    const { body } = response;
    expect(body).toHaveProperty('code', 200);
    expect(body).toHaveProperty('ok', true);
    expect(body).toHaveProperty('message', 'Perfil atualizado com sucesso');
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('email');
    expect(body.data).toHaveProperty('name');
    expect(body.data).toHaveProperty('role');
    expect(body.data).toHaveProperty('createdAt');
    expect(body.data).toHaveProperty('updatedAt');
    expect(body.data).not.toHaveProperty('password');
  });
});
