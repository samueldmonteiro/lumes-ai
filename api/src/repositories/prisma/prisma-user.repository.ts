import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';
import { User } from '@/generated/prisma/client';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({
      data,
      select: { id: true, email: true, name: true, role: true },
    });
  }

  update(
    id: number,
    data: Partial<Pick<User, 'email' | 'name' | 'role' | 'password'>>,
  ) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
