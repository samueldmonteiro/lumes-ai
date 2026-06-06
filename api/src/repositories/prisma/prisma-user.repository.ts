import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';
import { User } from '@/generated/prisma/client';

const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });
  }

  create(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({
      data,
      select: { id: true, email: true, name: true, role: true },
    });
  }

  update(id: number, data: Partial<Pick<User, 'email' | 'name' | 'password'>>) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: safeUserSelect,
    });
  }
}
