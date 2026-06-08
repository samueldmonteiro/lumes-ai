import { PrismaService } from "../../services/prisma.service";
import { User } from "../../generated/prisma/client";
export declare class PrismaUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): import("../../generated/prisma/models").Prisma__UserClient<{
        email: string;
        createdAt: Date;
        id: number;
        name: string;
        updatedAt: Date;
        role: import("@/generated/prisma/client").UserRole;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    create(data: {
        email: string;
        password: string;
        name: string;
    }): import("../../generated/prisma/models").Prisma__UserClient<{
        email: string;
        id: number;
        name: string;
        role: import("@/generated/prisma/client").UserRole;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, data: Partial<Pick<User, 'email' | 'name' | 'password'>>): import("../../generated/prisma/models").Prisma__UserClient<{
        email: string;
        createdAt: Date;
        id: number;
        name: string;
        updatedAt: Date;
        role: import("@/generated/prisma/client").UserRole;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
