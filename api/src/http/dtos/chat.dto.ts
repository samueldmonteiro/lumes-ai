import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRequestDto {
  @ApiProperty({ 
    description: 'A pergunta ou dúvida do aluno para o assistente virtual',
    example: 'Quais são os cursos disponíveis na faculdade?',
  })
  @IsString({ message: 'A pergunta deve ser um texto válido' })
  @IsNotEmpty({ message: 'A pergunta não pode estar vazia' })
  @MinLength(3, { message: 'A pergunta é muito curta' })
    question!: string;
}
