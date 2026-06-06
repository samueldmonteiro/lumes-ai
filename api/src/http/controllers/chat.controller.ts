import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from '@/services/chat.service';
import { BaseController } from './base.controller';
import {
  ChatRequestDto,
  AskResponseDto,
  ChatHistoryResponseDto,
  ChatSessionsResponseDto,
  ChatSessionDetailsResponseDto,
  DeleteSessionResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  NotFoundResponseDto,
} from '../dtos/chat.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { type JwtPayload } from '@/types/user.type';

@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController extends BaseController {
  constructor(private readonly chatService: ChatService) {
    super();
  }

  @Post('ask')
  @Public()
  @ApiOperation({ summary: 'Envia uma pergunta ao assistente virtual (RAG)' })
  @ApiOkResponse({
    description:
      'Pergunta processada com sucesso. Retorna a resposta gerada e as fontes utilizadas.',
    type: AskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Erros de validação nos dados enviados.',
    type: BadRequestResponseDto,
  })
  async ask(@Body() body: ChatRequestDto, @CurrentUser() user?: JwtPayload) {
    const response = await this.chatService.ask(
      body.question,
      user ?? null,
      body.sessionId,
      body.history,
    );
    return this.success(response, 'Pergunta processada com sucesso');
  }

  @Get('history')
  @ApiOperation({ summary: 'Recupera o histórico de conversas avulsas' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade máxima de registros a retornar (padrão: 20)',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Histórico recuperado com sucesso.',
    type: ChatHistoryResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente ou inválido.',
    type: UnauthorizedResponseDto,
  })
  async getHistory(
    @CurrentUser() user: JwtPayload,
    @Query('limit') limit?: number,
  ) {
    const history = await this.chatService.getHistory(
      limit ? Number(limit) : undefined,
      user,
    );
    return this.success(history, 'Histórico recuperado com sucesso');
  }

  @Get('sessions')
  @ApiOperation({
    summary: 'Recupera a lista de sessões de chat do usuário logado',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade máxima de sessões a retornar (padrão: 20)',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Lista de sessões recuperada com sucesso.',
    type: ChatSessionsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente ou inválido.',
    type: UnauthorizedResponseDto,
  })
  async getSessions(
    @CurrentUser() user: JwtPayload,
    @Query('limit') limit?: number,
  ) {
    const sessions = await this.chatService.getSessions(
      Number(user.sub),
      limit ? Number(limit) : undefined,
    );
    return this.success(sessions, 'Sessões recuperadas com sucesso');
  }

  @Get('sessions/:id')
  @ApiOperation({
    summary:
      'Recupera os detalhes de uma sessão de chat (com histórico de mensagens)',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da sessão de chat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Detalhes da sessão recuperados com sucesso.',
    type: ChatSessionDetailsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente ou inválido.',
    type: UnauthorizedResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Sessão de chat não encontrada ou não pertence ao usuário.',
    type: NotFoundResponseDto,
  })
  async getSessionDetails(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const session = await this.chatService.getSessionDetails(
      id,
      Number(user.sub),
    );
    return this.success(session, 'Detalhes da sessão recuperados com sucesso');
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Exclui uma sessão de chat' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'UUID da sessão de chat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Sessão excluída com sucesso.',
    type: DeleteSessionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente ou inválido.',
    type: UnauthorizedResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Sessão de chat não encontrada ou não pertence ao usuário.',
    type: NotFoundResponseDto,
  })
  async deleteSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.chatService.deleteSession(id, Number(user.sub));
    return this.success(null, 'Sessão excluída com sucesso');
  }
}
