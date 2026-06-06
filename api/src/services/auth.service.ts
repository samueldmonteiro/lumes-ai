import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user.repository';
import { RegisterDto, LoginDto } from '@/http/dtos';
import { EmailAlreadyExistsError, InvalidCredentialsError } from '@/exeptions';

import { UserRole } from '@/generated/prisma/client';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepo: PrismaUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findByEmail(dto.email);

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return payload;
    } catch (error) {
      this.logger.warn(
        `Token validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return null;
    }
  }
}
