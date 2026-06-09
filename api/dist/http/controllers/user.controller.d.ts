import { UserService } from "../../services/user.service";
import { type JwtPayload } from "../../types/user.type";
import { BaseController } from './base.controller';
import { UpdateProfileDto } from '../dtos';
export declare class UserController extends BaseController {
    private readonly userService;
    constructor(userService: UserService);
    updateProfile(user: JwtPayload, body: UpdateProfileDto): Promise<import("./base.controller").ApiResponse<{
        role: import("../../generated/prisma/enums").UserRole;
        email: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>>;
}
