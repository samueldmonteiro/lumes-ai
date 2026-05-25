import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
  })
  @IsString({ message: 'A senha deve ser um texto válido' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password!: string;
}
