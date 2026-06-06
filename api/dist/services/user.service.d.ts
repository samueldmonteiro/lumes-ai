import { PrismaUserRepository } from "../repositories/prisma/prisma-user.repository";
import { UpdateProfileDto } from "../http/dtos";
export declare class UserService {
    private readonly userRepo;
    private readonly logger;
    constructor(userRepo: PrismaUserRepository);
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        role: import("../generated/prisma/enums").UserRole;
    }>;
}
