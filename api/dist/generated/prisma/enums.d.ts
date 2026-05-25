export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly USER: "USER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
