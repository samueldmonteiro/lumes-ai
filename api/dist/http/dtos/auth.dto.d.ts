export declare class AuthUserDto {
    id: number;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class LoginUserDto {
    id: number;
    email: string;
    name: string;
    role: string;
}
export declare class RegisterResponseDataDto {
    token: string;
    user: AuthUserDto;
}
export declare class RegisterResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: RegisterResponseDataDto;
}
export declare class LoginResponseDataDto {
    token: string;
    user: LoginUserDto;
}
export declare class LoginResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: LoginResponseDataDto;
}
export declare class MeResponseDataDto {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
export declare class ConflictResponseDto {
    code: number;
    ok: boolean;
    message: string;
}
export declare class MeResponseDto {
    code: number;
    ok: boolean;
    message: string;
    data: MeResponseDataDto;
}
