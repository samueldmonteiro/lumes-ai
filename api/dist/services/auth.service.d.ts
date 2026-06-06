import { JwtService } from '@nestjs/jwt';
import { PrismaUserRepository } from "../repositories/prisma/prisma-user.repository";
import { RegisterDto, LoginDto } from "../http/dtos";
import { UserRole } from "../generated/prisma/client";
export interface JwtPayload {
    sub: number;
    email: string;
    role: UserRole;
}
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly logger;
    constructor(userRepo: PrismaUserRepository, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            name: string;
            id: number;
            email: string;
            role: UserRole;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: UserRole;
        };
    }>;
    validateToken(token: string): Promise<JwtPayload | null>;
}
