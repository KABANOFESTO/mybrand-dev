import { registerAs } from '@nestjs/config';
import {
  buildPostgresUrl,
  envBoolean,
  envNumber,
} from '../shared/helpers/env.helper';

export default registerAs(
  'database',
  () => {
    const host = process.env.DB_HOST || 'localhost';
    const port = envNumber(process.env.DB_PORT, 5432);
    const username = process.env.DB_USERNAME || 'postgres';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'mybranddb';
    const url =
      process.env.DATABASE_URL ||
      buildPostgresUrl({
        host,
        port,
        username,
        password,
        database,
      });

    return {
      host,
      port,
      username,
      password,
      database,
      url,
      ssl: envBoolean(process.env.DB_SSL, false),
      rejectUnauthorized: envBoolean(
        process.env.DB_SSL_REJECT_UNAUTHORIZED,
        false,
      ),
      synchronize: envBoolean(process.env.DB_SYNCHRONIZE, false),
      logging: process.env.NODE_ENV === 'development',
    };
  },
);
