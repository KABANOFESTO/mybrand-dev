import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppErrorCode } from '@common/enums/app-error-code.enum';
import { RequestHeader } from '@common/enums/request-header.enum';
import type { ApiErrorResponse } from '@common/interfaces/api-error-response.interface';
import type { RequestWithContext } from '@common/interfaces/request-context.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestWithContext = request as unknown as Partial<RequestWithContext>;

    const httpException = exception instanceof HttpException ? exception : null;
    const statusCode = httpException?.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = httpException?.getResponse();
    const message = this.resolveMessage(exception, responseBody, statusCode);
    const error = this.resolveErrorCode(statusCode);

    const payload: ApiErrorResponse = {
      success: false,
      message,
      statusCode,
      error: {
        code: error,
        path: request.url,
        method: request.method,
        requestId: requestWithContext.requestId ?? (request.header(RequestHeader.REQUEST_ID) ?? undefined),
        details: this.resolveDetails(responseBody),
      },
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${statusCode} ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(statusCode).json(payload);
  }

  private resolveMessage(exception: unknown, responseBody: unknown, statusCode: number) {
    if (typeof responseBody === 'string') {
      return responseBody;
    }

    if (responseBody && typeof responseBody === 'object' && 'message' in responseBody) {
      const message = (responseBody as { message?: string | string[] }).message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    if (exception instanceof Error && statusCode >= 500) {
      return 'Internal server error';
    }

    return 'Request failed';
  }

  private resolveDetails(responseBody: unknown) {
    if (!responseBody || typeof responseBody !== 'object') {
      return undefined;
    }

    if ('message' in responseBody) {
      return responseBody;
    }

    return responseBody;
  }

  private resolveErrorCode(statusCode: number): AppErrorCode {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return AppErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return AppErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return AppErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return AppErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return AppErrorCode.CONFLICT;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return AppErrorCode.VALIDATION_ERROR;
      default:
        return AppErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}

