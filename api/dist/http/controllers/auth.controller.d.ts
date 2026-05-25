import { AuthService } from "../../services/auth.service";
import { BaseController } from './base.controller';
import { RegisterDto, LoginDto } from '../dtos';
export declare class AuthController extends BaseController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<import("./base.controller").ApiResponse<{
        user: {
            email: string;
            name: string;
            id: number;
        };
        token: string;
    }>>;
    login(body: LoginDto): Promise<import("./base.controller").ApiResponse<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>>;
    me(user: any): import("./base.controller").ApiResponse<any>;
}
