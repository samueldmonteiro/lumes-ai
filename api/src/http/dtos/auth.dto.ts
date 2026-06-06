import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id!: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail do usuário',
  })
  email!: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
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
    example: '2026-06-06T18:04:18.000Z',
    description: 'Data de atualização',
  })
  updatedAt!: Date;
}

export class LoginUserDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id!: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail do usuário',
  })
  email!: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  name!: string;

  @ApiProperty({
    example: 'USER',
    enum: ['USER', 'ADMIN'],
    description: 'Papel do usuário',
  })
  role!: string;
}

export class RegisterResponseDataDto {
  @ApiProperty({
    description: 'Token JWT de autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token!: string;

  @ApiProperty({
    type: AuthUserDto,
    description: 'Dados do usuário registrado',
  })
  user!: AuthUserDto;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 201 })
  code!: number;

  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({ example: 'Usuário registrado com sucesso' })
  message!: string;

  @ApiProperty({ type: RegisterResponseDataDto })
  data!: RegisterResponseDataDto;
}

export class LoginResponseDataDto {
  @ApiProperty({
    description: 'Token JWT de autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token!: string;

  @ApiProperty({
    type: LoginUserDto,
    description: 'Dados do usuário autenticado',
  })
  user!: LoginUserDto;
}

export class LoginResponseDto {
  @ApiProperty({ example: 200 })
  code!: number;

  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({ example: 'Autenticação realizada com sucesso' })
  message!: string;

  @ApiProperty({ type: LoginResponseDataDto })
  data!: LoginResponseDataDto;
}

export class MeResponseDataDto {
  @ApiProperty({ example: 1, description: 'ID do usuário (sub do JWT)' })
  sub!: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail do usuário',
  })
  email!: string;

  @ApiProperty({
    example: 'USER',
    enum: ['USER', 'ADMIN'],
    description: 'Papel do usuário',
  })
  role!: string;

  @ApiProperty({
    example: 1717711458,
    description: 'Timestamp de emissão do token',
  })
  iat!: number;

  @ApiProperty({
    example: 1717715058,
    description: 'Timestamp de expiração do token',
  })
  exp!: number;
}

export class ConflictResponseDto {
  @ApiProperty({ example: 409 })
  code!: number;

  @ApiProperty({ example: false })
  ok!: boolean;

  @ApiProperty({ example: 'Este e-mail já está cadastrado.' })
  message!: string;
}

export class MeResponseDto {
  @ApiProperty({ example: 200 })
  code!: number;

  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({ example: 'Perfil do usuário recuperado com sucesso' })
  message!: string;

  @ApiProperty({ type: MeResponseDataDto })
  data!: MeResponseDataDto;
}
