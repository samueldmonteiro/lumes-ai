import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';

@Injectable()
export class PrismaChatSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; userId: number }) {
    return this.prisma.chatSession.create({ data });
  }

  async findMany(userId: number, limit: number) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }

  async findById(id: string, userId: number) {
    return this.prisma.chatSession.findFirst({
      where: { id, userId },
      include: {
        chatLogs: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async delete(id: string, userId: number) {
    return this.prisma.chatSession.deleteMany({
      where: { id, userId },
    });
  }
}
