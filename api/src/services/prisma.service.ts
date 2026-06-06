import 'dotenv/config';
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  readonly schema: string;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.warn('WARNING: DATABASE_URL environment variable is missing.');
    }

    // Fallback to a placeholder URL just to prevent 'new URL' throwing a sync hard crash.
    // The Pg adapter will still fail if queries are actually attempted without a real DB.
    const databaseURL = new URL(
      connectionString || 'postgres://placeholder@localhost/db',
    );
    const schema = databaseURL.searchParams.get('schema') ?? 'public';

    const adapter = new PrismaPg(
      { connectionString: connectionString || '' },
      { schema: schema },
    );

    super({
      adapter,
      log: process.env.NODE_ENV == 'development' ? ['error'] : undefined,
    });

    this.schema = schema;
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conectado ao banco de dados');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconectado do banco de dados');
  }
}
