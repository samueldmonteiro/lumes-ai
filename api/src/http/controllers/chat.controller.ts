import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ChatService } from '@/services/chat.service';
import { BaseController } from './base.controller';
import { ChatRequestDto } from '../dtos/chat.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController extends BaseController {
  constructor(private readonly chatService: ChatService) {
    super();
  }

  @Post('ask')
  @ApiOperation({ summary: 'Envia uma pergunta ao assistente virtual (RAG)' })
  async ask(@Body() body: ChatRequestDto) {
    const response = await this.chatService.ask(body.question);
    return this.success(response, 'Pergunta processada com sucesso');
  }

  @Get('history')
  @ApiOperation({ summary: 'Recupera o histórico de conversas' })
  async getHistory(@Query('limit') limit?: number) {
    const history = await this.chatService.getHistory(limit ? Number(limit) : undefined);
    return this.success(history, 'Histórico recuperado com sucesso');
  }
}