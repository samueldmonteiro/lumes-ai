import { IsString, IsNotEmpty, IsOptional, MinLength, IsObject } from 'class-validator';
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
}

export class IngestJsonDto {
  @ApiProperty({
    description: 'Objeto JSON a ser achatado, transformado em texto e indexado como chunks',
    example: { produto: 'Lumes AI', versao: '1.0', features: ['RAG', 'chat'] },
  })
  @IsObject({ message: 'O campo data deve ser um objeto JSON válido' })
  @IsNotEmpty({ message: 'O campo data é obrigatório' })
    data!: Record<string, unknown>;

  @ApiProperty({
    description: 'Origem do documento para rastreabilidade',
    example: 'config-v1',
    required: false,
    default: 'json-manual',
  })
  @IsString()
  @IsOptional()
    source?: string;
}
