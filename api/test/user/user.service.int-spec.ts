import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';
import { UserService } from '@/services/user.service';
import { PrismaService } from '@/services/prisma.service';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user.repository';
import { UserNotFoundError } from '@/exeptions/user-not-found.error';
import { EmailAlreadyExistsError } from '@/exeptions/email-already-exists.error';
import * as argon2 from 'argon2';

describe('UserService (integration)', () => {
  let module: TestingModule;
  let userService: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [PrismaService, PrismaUserRepository, UserService],
    }).compile();

    userService = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await prisma.chatLog.deleteMany({});
    await prisma.chatSession.deleteMany({});
    await prisma.user.deleteMany({});
  });

  // ── Helper ────────────────────────────────────────────────────────────────

  async function createUser(
    overrides: Partial<{ email: string; name: string }> = {},
  ) {
    return prisma.user.create({
      data: {
        email: overrides.email ?? 'user@example.com',
        password: await argon2.hash('senha123'),
        name: overrides.name ?? 'Test User',
      },
    });
  }

  // ── updateProfile() ───────────────────────────────────────────────────────

  describe('updateProfile()', () => {
    it('should update name only', async () => {
      const user = await createUser();

      const result = await userService.updateProfile(user.id, {
        name: 'Novo Nome',
      });

      expect(result.name).toBe('Novo Nome');
      expect(result.email).toBe(user.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should update email only', async () => {
      const user = await createUser();

      const result = await userService.updateProfile(user.id, {
        email: 'novo@example.com',
      });

      expect(result.email).toBe('novo@example.com');
      expect(result.name).toBe(user.name);
    });

    it('should hash and update password', async () => {
      const user = await createUser();

      await userService.updateProfile(user.id, { password: 'novaSenha456' });

      const updated = await prisma.user.findUnique({ where: { id: user.id } });

      expect(updated).not.toBeNull();
      const isValid = await argon2.verify(updated!.password, 'novaSenha456');
      expect(isValid).toBe(true);
    });

    it('should update multiple fields at once', async () => {
      const user = await createUser();

      const result = await userService.updateProfile(user.id, {
        name: 'Nome Atualizado',
        email: 'atualizado@example.com',
      });

      expect(result.name).toBe('Nome Atualizado');
      expect(result.email).toBe('atualizado@example.com');
    });

    it('should not change fields that are not provided', async () => {
      const user = await createUser({
        name: 'Nome Original',
        email: 'original@example.com',
      });

      const result = await userService.updateProfile(user.id, {
        name: 'Apenas Nome',
      });

      expect(result.email).toBe('original@example.com');
      expect(result.name).toBe('Apenas Nome');
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      await expect(
        userService.updateProfile(99999, { name: 'Fantasma' }),
      ).rejects.toThrow(UserNotFoundError);
    });

    it('should throw EmailAlreadyExistsError when new email belongs to another user', async () => {
      await createUser({ email: 'taken@example.com', name: 'User A' });
      const userB = await createUser({
        email: 'userb@example.com',
        name: 'User B',
      });

      await expect(
        userService.updateProfile(userB.id, { email: 'taken@example.com' }),
      ).rejects.toThrow(EmailAlreadyExistsError);
    });

    it('should allow keeping the same email without throwing', async () => {
      const user = await createUser({ email: 'same@example.com' });

      const result = await userService.updateProfile(user.id, {
        email: 'same@example.com',
        name: 'Nome Atualizado',
      });

      expect(result.email).toBe('same@example.com');
      expect(result.name).toBe('Nome Atualizado');
    });

    it('should return safe fields without password', async () => {
      const user = await createUser();

      const result = await userService.updateProfile(user.id, {
        name: 'Seguro',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).not.toHaveProperty('password');
    });
  });
});
