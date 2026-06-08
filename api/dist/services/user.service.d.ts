import { PrismaUserRepository } from "../repositories/prisma/prisma-user.repository";
import { UpdateProfileDto } from "../http/dtos";
export declare class UserService {
    private readonly userRepo;
    private readonly logger;
    constructor(userRepo: PrismaUserRepository);
    updateProfile(userId: number, dto: UpdateProfileDto): Promise<{
        email: string;
        createdAt: Date;
        id: number;
        name: string;
        updatedAt: Date;
        role: import("../generated/prisma/enums").UserRole;
    }>;
}
