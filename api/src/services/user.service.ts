import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user.repository';
import { UpdateProfileDto } from '@/http/dtos';
import { EmailAlreadyExistsError, UserNotFoundError } from '@/exeptions';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepo: PrismaUserRepository) {}

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    // If email is being changed, ensure it is not already taken by another user.
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepo.findByEmail(dto.email);
      if (existingUser) {
        throw new EmailAlreadyExistsError();
      }
    }

    const updateData: Parameters<typeof this.userRepo.update>[1] = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }

    if (dto.password !== undefined) {
      this.logger.log(`Hashing new password for user ${userId}`);
      updateData.password = await argon2.hash(dto.password);
    }

    const updated = await this.userRepo.update(userId, updateData);

    this.logger.log(`Profile updated for user ${userId}`);

    return updated;
  }
}
