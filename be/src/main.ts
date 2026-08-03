import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { join } from 'node:path';
import { AppModule } from '@app/app.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { RequestLoggingInterceptor } from '@common/interceptors/request-logging.interceptor';
import { TrimStringsPipe } from '@common/pipes/trim-strings.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  const expressApp = app as NestExpressApplication;
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
  expressApp.useStaticAssets(join(process.cwd(), 'uploads', 'avatars'), { prefix: '/uploads/avatars' });
  expressApp.useStaticAssets(join(process.cwd(), 'uploads', 'projects'), { prefix: '/uploads/projects' });
  expressApp.useStaticAssets(join(process.cwd(), 'uploads', 'certificates', 'images'), { prefix: '/uploads/certificates/images' });
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor());
  app.useGlobalPipes(
    new TrimStringsPipe(),
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
