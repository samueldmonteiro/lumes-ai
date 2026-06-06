import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';

export interface ChatLogEntry {
  id: number;
  question: string;
  answer: string;
  similarity: number | null;
  createdAt: Date;
}

@Injectable()
export class PrismaChatLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    question: string;
    answer: string;
    sources: object[];
    similarity: number;
    userId: number | null;
    sessionId?: string | null;
  }) {
    return this.prisma.chatLog.create({ data });
  }

  findMany(userId: number | null, limit: number): Promise<ChatLogEntry[]> {
    return this.prisma.chatLog.findMany({
      where: userId ? { userId } : { userId: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        question: true,
        answer: true,
        similarity: true,
        createdAt: true,
      },
    });
  }
}
