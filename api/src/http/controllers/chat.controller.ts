import { Controller, Post, Body, Get, Query, UseGuards, Param, Delete } from '@nestjs/common';
import { ChatService } from '@/services/chat.service';
import { BaseController } from './base.controller';
import { ChatRequestDto } from '../dtos/chat.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  @Public()
  @ApiOperation({ summary: 'Recupera o histórico de conversas avulsas' })
  async getHistory(
    @Query('limit') limit?: number,
    @CurrentUser() user?: JwtPayload,
  ) {
    const history = await this.chatService.getHistory(
      limit ? Number(limit) : undefined,
      user ?? null,
    );
    return this.success(history, 'Histórico recuperado com sucesso');
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Recupera a lista de sessões de chat do usuário logado' })
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
  @ApiOperation({ summary: 'Recupera os detalhes de uma sessão de chat (com histórico de mensagens)' })
  async getSessionDetails(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const session = await this.chatService.getSessionDetails(id, Number(user.sub));
    return this.success(session, 'Detalhes da sessão recuperados com sucesso');
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Exclui uma sessão de chat' })
  async deleteSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.chatService.deleteSession(id, Number(user.sub));
    return this.success(null, 'Sessão excluída com sucesso');
  }
}
