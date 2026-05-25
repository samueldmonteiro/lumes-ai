import { JwtService } from '@nestjs/jwt';
import { PrismaService } from "./prisma.service";
import { RegisterDto, LoginDto } from "../http/dtos";
export interface JwtPayload {
    sub: string;
    email: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            email: string;
            name: string;
            id: number;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    validateToken(token: string): Promise<JwtPayload | null>;
}
