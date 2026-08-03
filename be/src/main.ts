import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const globalPrefix = configService.get<string>('app.apiPrefix', 'api');
  const port = configService.get<number>('app.port', 3000);
  const corsOrigin = configService.get<string[]>('app.corsOrigin', [
    'http://localhost:5173',
  ]);

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
