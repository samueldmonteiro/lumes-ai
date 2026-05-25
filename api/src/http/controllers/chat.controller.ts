import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
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
    const response = await this.chatService.ask(body.question, user ?? null);
    return this.success(response, 'Pergunta processada com sucesso');
  }

  @Get('history')
  @Public()
  @ApiOperation({ summary: 'Recupera o histórico de conversas' })
  async getHistory(@Query('limit') limit?: number, @CurrentUser() user?: JwtPayload) {
    const history = await this.chatService.getHistory(
      limit ? Number(limit) : undefined,
      user ?? null,
    );
    return this.success(history, 'Histórico recuperado com sucesso');
  }
}