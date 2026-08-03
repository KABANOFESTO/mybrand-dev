import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { buildPostgresUrl, envBoolean } from '@shared/helpers/env.helper';

function resolveDatabaseUrl() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 5432);
  const username = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'mybranddb';

  return (
    process.env.DATABASE_URL ||
    buildPostgresUrl({
      host,
      port,
      username,
      password,
      database,
    })
  );
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: resolveDatabaseUrl(),
        },
      },
      log: envBoolean(process.env.PRISMA_LOG_QUERIES, false)
        ? ['query', 'warn', 'error']
        : process.env.NODE_ENV === 'development'
          ? ['warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
