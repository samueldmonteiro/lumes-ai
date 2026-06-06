import { PrismaService } from "../../services/prisma.service";
export declare class PrismaChatSessionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        userId: number;
    }): Promise<{
        createdAt: Date;
        id: string;
        userId: number;
        title: string;
        updatedAt: Date;
    }>;
    findMany(userId: number, limit: number): Promise<{
        createdAt: Date;
        id: string;
        userId: number;
        title: string;
        updatedAt: Date;
    }[]>;
    findById(id: string, userId: number): Promise<({
        chatLogs: {
            question: string;
            answer: string;
            sources: import("@prisma/client/runtime/client").JsonValue;
            similarity: number | null;
            createdAt: Date;
            id: number;
            userId: number | null;
            sessionId: string | null;
        }[];
    } & {
        createdAt: Date;
        id: string;
        userId: number;
        title: string;
        updatedAt: Date;
    }) | null>;
    delete(id: string, userId: number): Promise<import("../../generated/prisma/internal/prismaNamespace").BatchPayload>;
}
