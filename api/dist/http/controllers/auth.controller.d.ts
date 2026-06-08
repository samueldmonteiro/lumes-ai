import { AuthService } from "../../services/auth.service";
import { type JwtPayload } from "../../types/user.type";
import { BaseController } from './base.controller';
import { RegisterDto, LoginDto } from '../dtos';
export declare class AuthController extends BaseController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<import("./base.controller").ApiResponse<{
        user: {
            email: string;
            id: number;
            name: string;
            role: import("../../generated/prisma/enums").UserRole;
        };
        token: string;
    }>>;
    login(body: LoginDto): Promise<import("./base.controller").ApiResponse<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: import("../../generated/prisma/enums").UserRole;
        };
    }>>;
    me(user: JwtPayload): import("./base.controller").ApiResponse<JwtPayload>;
}
