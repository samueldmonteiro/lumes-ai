import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "./prisma.service";
import { RegisterDto, LoginDto } from "../http/dtos";
import { UserRole } from "../generated/prisma/client";
export interface JwtPayload {
    sub: number;
    email: string;
    role: UserRole;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: number;
            name: string;
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
