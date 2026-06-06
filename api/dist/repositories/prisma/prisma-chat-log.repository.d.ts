import { PrismaService } from "../../services/prisma.service";
export interface ChatLogEntry {
    id: number;
    question: string;
    answer: string;
    similarity: number | null;
    createdAt: Date;
}
export declare class PrismaChatLogRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        question: string;
        answer: string;
        sources: object[];
        similarity: number;
        userId: number | null;
        sessionId?: string | null;
    }): import("../../generated/prisma/models").Prisma__ChatLogClient<{
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
        sources: import("@prisma/client/runtime/client").JsonValue;
        similarity: number | null;
        userId: number | null;
        sessionId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findMany(userId: number | null, limit: number): Promise<ChatLogEntry[]>;
}
