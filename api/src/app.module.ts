import { Module } from '@nestjs/common';
import { AppController } from '@/http/controllers/app.controller';
import { IngestController } from './http/controllers/ingest.controller';
import { IngestService } from './services/ingest.service';
import { ChunkerService } from './services/chunker.service';
import { OllamaService } from './services/ollama.service';
import { SearchService } from './services/search.service';
import { PromptService } from './services/prompt.service';
import { ChatController } from './http/controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { AIProvider } from './ai/providers/ai.provider';
import { GeminiProvider } from './ai/providers/gemini.provider';

@Module({
  imports: [],
  controllers: [AppController, IngestController, ChatController],
  providers: [
    IngestService,
    ChunkerService,
    OllamaService,
    SearchService,
    PromptService,
    ChatService,
    GeminiProvider,
    {
      provide: AIProvider,
      useClass: GeminiProvider,
    },
  ],
})
export class AppModule { }
