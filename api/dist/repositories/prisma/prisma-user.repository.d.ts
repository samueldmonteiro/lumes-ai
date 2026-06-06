import { PrismaService } from "../../services/prisma.service";
import { User } from "../../generated/prisma/client";
export declare class PrismaUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    create(data: {
        email: string;
        password: string;
        name: string;
    }): import("../../generated/prisma/models").Prisma__UserClient<{
        id: number;
        email: string;
        name: string;
        role: import("../../generated/prisma/client").UserRole;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: number, data: Partial<Pick<User, 'email' | 'name' | 'role' | 'password'>>): import("../../generated/prisma/models").Prisma__UserClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        name: string;
        role: import("../../generated/prisma/client").UserRole;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
