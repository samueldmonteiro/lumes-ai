import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
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
    description:
      'ID da sessão de chat persistida (apenas para usuários autenticados)',
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

export class ChatResponseDto {
  @ApiProperty({
    description: 'Resposta textual gerada pelo assistente virtual',
    example:
      'Os cursos disponíveis incluem Engenharia de Software, Ciência da Computação e Sistemas de Informação.',
  })
    answer!: string;

  @ApiProperty({
    description: 'Lista de fontes/documentos de onde a informação foi extraída',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        source: { type: 'string', example: 'cursos_ti.pdf' },
        similarity: { type: 'number', example: 0.85 },
      },
    },
  })
    sources!: { source: string; similarity: number }[];

  @ApiProperty({
    description: 'Média de similaridade cosseno dos trechos encontrados',
    example: 0.85,
  })
    avgSimilarity!: number;

  @ApiProperty({
    description:
      'Quantidade de trechos (chunks) de informação utilizados no contexto',
    example: 2,
  })
    chunksUsed!: number;

  @ApiProperty({
    description: 'ID da sessão de chat associada (se aplicável)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
    sessionId?: string;
}

export class AskResponseDto {
  @ApiProperty({ example: 200 })
    code!: number;

  @ApiProperty({ example: true })
    ok!: boolean;

  @ApiProperty({ example: 'Pergunta processada com sucesso' })
    message!: string;

  @ApiProperty({ type: ChatResponseDto })
    data!: ChatResponseDto;
}

export class ChatLogEntryDto {
  @ApiProperty({ example: 1 })
    id!: number;

  @ApiProperty({ example: 'Quais são os cursos?' })
    question!: string;

  @ApiProperty({ example: 'Os cursos são...' })
    answer!: string;

  @ApiProperty({ example: 0.82, nullable: true })
    similarity!: number | null;

  @ApiProperty({ example: '2026-06-06T18:04:18.000Z' })
    createdAt!: Date;
}

export class ChatHistoryResponseDto {
  @ApiProperty({ example: 200 })
    code!: number;

  @ApiProperty({ example: true })
    ok!: boolean;

  @ApiProperty({ example: 'Histórico recuperado com sucesso' })
    message!: string;

  @ApiProperty({ type: [ChatLogEntryDto] })
    data!: ChatLogEntryDto[];
}

export class ChatSessionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id!: string;

  @ApiProperty({ example: 'Dúvida sobre horário' })
    title!: string;

  @ApiProperty({ example: 1 })
    userId!: number;

  @ApiProperty({ example: '2026-06-06T18:04:18.000Z' })
    createdAt!: Date;

  @ApiProperty({ example: '2026-06-06T18:04:18.000Z' })
    updatedAt!: Date;
}

export class ChatSessionsResponseDto {
  @ApiProperty({ example: 200 })
    code!: number;

  @ApiProperty({ example: true })
    ok!: boolean;

  @ApiProperty({ example: 'Sessões recuperadas com sucesso' })
    message!: string;

  @ApiProperty({ type: [ChatSessionDto] })
    data!: ChatSessionDto[];
}

export class ChatLogDetailDto {
  @ApiProperty({ example: 1 })
    id!: number;

  @ApiProperty({ example: 'Quais são os cursos?' })
    question!: string;

  @ApiProperty({ example: 'Os cursos são...' })
    answer!: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        source: { type: 'string', example: 'regulamento.pdf' },
        similarity: { type: 'number', example: 0.85 },
      },
    },
  })
    sources!: any;

  @ApiProperty({ example: 0.82, nullable: true })
    similarity!: number | null;

  @ApiProperty({ example: '2026-06-06T18:04:18.000Z' })
    createdAt!: Date;

  @ApiProperty({ example: 1 })
    userId!: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
    sessionId!: string | null;
}

export class ChatSessionDetailsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id!: string;

  @ApiProperty({ example: 'Dúvida sobre horário' })
    title!: string;

  @ApiProperty({ example: 1 })
    userId!: number;

  @ApiProperty({ example: '2026-06-06T18:04:18.000Z' })
    createdAt!: Date;

  @ApiProperty({ example: '2026-06-06T18:04:18.000Z' })
    updatedAt!: Date;

  @ApiProperty({ type: [ChatLogDetailDto] })
    chatLogs!: ChatLogDetailDto[];
}

export class ChatSessionDetailsResponseDto {
  @ApiProperty({ example: 200 })
    code!: number;

  @ApiProperty({ example: true })
    ok!: boolean;

  @ApiProperty({ example: 'Detalhes da sessão recuperados com sucesso' })
    message!: string;

  @ApiProperty({ type: ChatSessionDetailsDto })
    data!: ChatSessionDetailsDto;
}

export class DeleteSessionResponseDto {
  @ApiProperty({ example: 200 })
    code!: number;

  @ApiProperty({ example: true })
    ok!: boolean;

  @ApiProperty({ example: 'Sessão excluída com sucesso' })
    message!: string;

  @ApiProperty({ type: () => Object, nullable: true, example: null })
    data!: any;
}

export class BadRequestResponseDto {
  @ApiProperty({ example: 400 })
    code!: number;

  @ApiProperty({ example: false })
    ok!: boolean;

  @ApiProperty({ example: 'A pergunta deve ser um texto válido' })
    message!: string;
}

export class UnauthorizedResponseDto {
  @ApiProperty({ example: 401 })
    code!: number;

  @ApiProperty({ example: false })
    ok!: boolean;

  @ApiProperty({ example: 'Unauthorized' })
    message!: string;
}

export class NotFoundResponseDto {
  @ApiProperty({ example: 404 })
    code!: number;

  @ApiProperty({ example: false })
    ok!: boolean;

  @ApiProperty({ example: 'Sessão de chat não encontrada.' })
    message!: string;
}
