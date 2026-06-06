import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'O e-mail informado deve ser válido' })
  @IsNotEmpty({ message: 'O e-mail não pode estar vazio' })
    email!: string;

  @ApiProperty({
    description: 'Senha de acesso',
    example: 'senha123',
    minLength: 6,
  })
  @IsString({ message: 'A senha deve ser um texto válido' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password!: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString({ message: 'O nome deve ser um texto válido' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
    name!: string;
}
