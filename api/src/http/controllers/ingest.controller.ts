import { Body, Controller, Post } from '@nestjs/common';
import { IngestService } from '@/services/ingest.service';
import { BaseController } from './base.controller';
import { IngestTextDto } from '../dtos/ingest.dto';

@Controller('ingests')
export class IngestController extends BaseController {
  constructor(private readonly ingestService: IngestService) {
    super();
  }

  @Post('text')
  async ingestText(@Body() body: IngestTextDto) {
    return this.ingestService.ingestText(
      body.text,
      body.source ?? 'manual',
      body.category ?? 'geral',
    );
  }
}
