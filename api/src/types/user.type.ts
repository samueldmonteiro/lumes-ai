import { UserRole } from '@/generated/prisma/client';

export type UserSafe = {
  id: string;
  email: string;
  name: string;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};
