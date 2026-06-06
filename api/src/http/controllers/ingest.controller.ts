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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
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

@ApiTags('Ingest')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('ingests')
export class IngestController extends BaseController {
  constructor(private readonly ingestService: IngestService) {
    super();
  }

  @Post('text')
  @ApiOperation({
    summary: 'Ingere um texto bruto, transformando-o em chunks vetorizados',
  })
  @ApiCreatedResponse({
    description: 'Texto ingerido com sucesso',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 201 },
        ok: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Texto ingerido com sucesso!' },
        data: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            source: { type: 'string', example: 'manual-uuid' },
            chunksProcessed: { type: 'number', example: 5 },
            chunksSaved: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  async ingestText(@Body() body: IngestTextDto) {
    const result = await this.ingestService.ingestText(
      body.text,
      body.source ?? 'manual-' + randomUUID(),
    );
    return this.created(result, 'Texto ingerido com sucesso!');
  }

  @Post('pdf')
  @ApiOperation({
    summary:
      'Ingere um arquivo PDF, extraindo texto e gerando chunks vetorizados',
  })
  @ApiCreatedResponse({
    description: 'PDF ingerido com sucesso',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 201 },
        ok: { type: 'boolean', example: true },
        message: { type: 'string', example: 'PDF ingerido com sucesso!' },
        data: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            source: { type: 'string', example: 'pdf-uuid' },
            chunksProcessed: { type: 'number', example: 5 },
            chunksSaved: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo PDF e origem opcional',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo PDF (.pdf)',
        },
        source: {
          type: 'string',
          description: 'Origem do documento para rastreabilidade',
        },
      },
    },
  })
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
    const result = await this.ingestService.ingestPDF(file.buffer, finalSource);
    return this.created(result, 'PDF ingerido com sucesso!');
  }

  @Post('json')
  @ApiOperation({
    summary:
      'Ingere um objeto JSON, achatando-o em texto e gerando chunks vetorizados',
  })
  @ApiCreatedResponse({
    description: 'JSON ingerido com sucesso',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 201 },
        ok: { type: 'boolean', example: true },
        message: { type: 'string', example: 'JSON ingerido com sucesso!' },
        data: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            source: { type: 'string', example: 'json-uuid' },
            chunksProcessed: { type: 'number', example: 5 },
            chunksSaved: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  async ingestJson(@Body() body: IngestJsonDto) {
    const result = await this.ingestService.ingestJSON(
      body.data,
      body.source ?? `json-${randomUUID()}`,
    );
    return this.created(result, 'JSON ingerido com sucesso!');
  }
}
