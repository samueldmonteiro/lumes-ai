import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from '@/http/controllers/app.controller';
import { IngestController } from './http/controllers/ingest.controller';
import { IngestService } from './services/ingest.service';
import { ChunkerService } from './services/chunker.service';
import { SearchService } from './services/search.service';
import { PromptService } from './services/prompt.service';
import { ChatController } from './http/controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { GeminiProvider } from './providers/ai/LLM/gemini.provider';
import { PrismaService } from './services/prisma.service';
import { EmbeddingProvider } from './providers/ai/embedding/embedding.provider';
import { OllamaEmbeddingProvider } from './providers/ai/embedding/ollama-embedding.provider';
import { LLMProvider } from './providers/ai/LLM/llm.provider';
import { AuthService } from './services/auth.service';
import { AuthController } from './http/controllers/auth.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || process.env.JWT_TOKEN || 'fallback-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AppController, IngestController, ChatController, AuthController],
  providers: [
    PrismaService,
    IngestService,
    ChunkerService,
    SearchService,
    PromptService,
    ChatService,
    AuthService,
    GeminiProvider,
    {
      provide: LLMProvider,
      useClass: GeminiProvider,
    },
    {
      provide: EmbeddingProvider,
      useClass: OllamaEmbeddingProvider,
    },
  ],
})
export class AppModule { }
