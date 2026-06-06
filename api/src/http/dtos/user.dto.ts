import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

// ─── Request DTO ─────────────────────────────────────────────────────────────

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Novo e-mail do usuário',
    example: 'novo@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'O e-mail informado deve ser válido' })
    email?: string;

  @ApiPropertyOptional({
    description: 'Novo nome completo do usuário',
    example: 'Maria Oliveira',
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto válido' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
    name?: string;

  @ApiPropertyOptional({
    description: 'Nova senha de acesso (mínimo 6 caracteres)',
    example: 'novaSenha123',
    minLength: 6,
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser um texto válido' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password?: string;
}

// ─── Response DTOs (Swagger) ──────────────────────────────────────────────────

export class UpdatedUserDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
    id!: number;

  @ApiProperty({
    example: 'novo@example.com',
    description: 'E-mail do usuário',
  })
    email!: string;

  @ApiProperty({ example: 'Maria Oliveira', description: 'Nome completo' })
    name!: string;

  @ApiProperty({
    example: 'USER',
    enum: ['USER', 'ADMIN'],
    description: 'Papel do usuário',
  })
    role!: string;

  @ApiProperty({
    example: '2026-06-06T18:04:18.000Z',
    description: 'Data de criação',
  })
    createdAt!: Date;

  @ApiProperty({
    example: '2026-06-06T19:10:00.000Z',
    description: 'Data de atualização',
  })
    updatedAt!: Date;
}

export class UpdateProfileResponseDto {
  @ApiProperty({ example: 200 })
    code!: number;

  @ApiProperty({ example: true })
    ok!: boolean;

  @ApiProperty({ example: 'Perfil atualizado com sucesso' })
    message!: string;

  @ApiProperty({ type: UpdatedUserDto })
    data!: UpdatedUserDto;
}
