import { Module } from '@nestjs/common';
import { AppController } from '@/controllers/app.controller';
import { AppService } from '@/services/app.service';
import { IngestController } from './controllers/ingest.controller';
import { IngestService } from './services/ingest.service';
import { ChunkerService } from './services/chunker.service';
import { OllamaService } from './services/ollama.service';

@Module({
  imports: [],
  controllers: [AppController, IngestController],
  providers: [AppService, IngestService, ChunkerService, OllamaService],
})
export class AppModule { }
