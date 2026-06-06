import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngestService } from '@/services/ingest.service';
import { BaseController } from './base.controller';
import { IngestTextDto, IngestJsonDto } from '../dtos/ingest.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '@/generated/prisma/client';
import { randomUUID } from 'node:crypto';

/** Subconjunto de campos do multer File relevantes para o controller. */
interface UploadedMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('ingests')
export class IngestController extends BaseController {
  constructor(private readonly ingestService: IngestService) {
    super();
  }

  @Post('text')
  async ingestText(@Body() body: IngestTextDto) {
    const result = await this.ingestService.ingestText(
      body.text,
      body.source ?? 'manual-' + randomUUID(),
    );
    return this.created(result, 'Texto ingerido com sucesso!');
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async ingestPDF(
    @UploadedFile() file: UploadedMulterFile | undefined,
    @Body('source') source?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo PDF enviado.');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'Tipo de arquivo inválido. Apenas PDFs são aceitos.',
      );
    }
    const finalSource = source ?? `pdf-${randomUUID()}`;
    const result = await this.ingestService.ingestPDF(
      file.buffer,
      finalSource,
    );
    return this.created(result, 'PDF ingerido com sucesso!');
  }

  @Post('json')
  async ingestJson(@Body() body: IngestJsonDto) {
    const result = await this.ingestService.ingestJSON(
      body.data,
      body.source ?? `json-${randomUUID()}`,
    );
    return this.created(result, 'JSON ingerido com sucesso!');
  }
}
