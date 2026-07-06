import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const useUrl = !!process.env.DB_URL;
    const sslEnabled = process.env.DB_SSL === 'true';
    const rejectUnauthorized =
      process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

    return {
      type: 'postgres',
      ...(useUrl
        ? { url: process.env.DB_URL }
        : {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'codecircle_db',
          }),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 3,
      retryDelay: 3000,
      autoLoadEntities: true,
      ssl: sslEnabled
        ? {
            rejectUnauthorized,
          }
        : undefined,
    };
  },
);
