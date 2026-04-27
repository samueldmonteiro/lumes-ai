import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IngestTextDto {
  @ApiProperty({
    description: 'Texto bruto para ser processado e transformado em chunks',
    example: 'O sistema Lumes AI utiliza RAG para responder perguntas...',
  })
  @IsString({ message: 'O campo text deve ser uma string' })
  @IsNotEmpty({ message: 'O campo text é obrigatório' })
  @MinLength(10, { message: 'O texto deve ter pelo menos 10 caracteres' })
    text!: string;

  @ApiProperty({
    description: 'Origem do documento para rastreabilidade',
    example: 'manual',
    required: false,
    default: 'manual',
  })
  @IsString()
  @IsOptional()
    source?: string;

  @ApiProperty({
    description: 'Categoria para agrupar o conhecimento',
    example: 'geral',
    required: false,
    default: 'geral',
  })
  @IsString()
  @IsOptional()
    category?: string;
}
