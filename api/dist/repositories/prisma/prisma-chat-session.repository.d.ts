import { PrismaService } from "../../services/prisma.service";
export declare class PrismaChatSessionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        userId: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
    }>;
    findMany(userId: number, limit: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
    }[]>;
    findById(id: string, userId: number): Promise<({
        chatLogs: {
            id: number;
            createdAt: Date;
            question: string;
            answer: string;
            sources: import("@prisma/client/runtime/client").JsonValue;
            similarity: number | null;
            userId: number | null;
            sessionId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
    }) | null>;
    delete(id: string, userId: number): Promise<import("../../generated/prisma/internal/prismaNamespace").BatchPayload>;
}
