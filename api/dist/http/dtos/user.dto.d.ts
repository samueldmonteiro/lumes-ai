export declare class UpdateProfileDto {
    email?: string;
    name?: string;
    password?: string;
}
export declare class UpdatedUserDto {
    id: number;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UpdateProfileResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: UpdatedUserDto;
}
