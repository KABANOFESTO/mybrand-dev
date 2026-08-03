import { Injectable, NestMiddleware } from '@nestjs/common';
import { requestContextMiddleware } from './request-context.middleware';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(...args: Parameters<typeof requestContextMiddleware>) {
    return requestContextMiddleware(...args);
  }
}
