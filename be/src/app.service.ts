import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getAppInfo() {
    return {
      name: this.configService.get<string>('app.name', 'mybrand'),
      version: this.configService.get<string>('app.version', '1.0.0'),
      environment: this.configService.get<string>(
        'app.environment',
        'development',
      ),
      apiPrefix: this.configService.get<string>('app.apiPrefix', 'api'),
    };
  }

  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
