import { IsString, IsNotEmpty, MinLength, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ example: 'user', enum: ['user', 'model'] })
  @IsString({ message: 'O papel deve ser um texto válido' })
    role!: 'user' | 'model';

  @ApiProperty({ example: 'Qual é o horário da biblioteca?' })
  @IsString({ message: 'O conteúdo deve ser um texto válido' })
  @IsNotEmpty({ message: 'O conteúdo não pode estar vazio' })
    content!: string;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'A pergunta ou dúvida do aluno para o assistente virtual',
    example: 'Quais são os cursos disponíveis na faculdade?',
  })
  @IsString({ message: 'A pergunta deve ser um texto válido' })
  @IsNotEmpty({ message: 'A pergunta não pode estar vazia' })
  @MinLength(3, { message: 'A pergunta é muito curta' })
    question!: string;

  @ApiProperty({
    description: 'ID da sessão de chat persistida (apenas para usuários autenticados)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString({ message: 'O ID da sessão deve ser um texto válido' })
    sessionId?: string;

  @ApiProperty({
    description: 'Histórico da conversa atual (usado para usuários deslogados)',
    type: [ChatMessageDto],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'O histórico deve ser uma lista de mensagens' })
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
    history?: ChatMessageDto[];
}
