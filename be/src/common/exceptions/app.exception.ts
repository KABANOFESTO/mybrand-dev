import { AppErrorCode } from '@common/enums/app-error-code.enum';

export class AppException extends Error {
  constructor(
    message: string,
    public readonly code: AppErrorCode,
    public readonly statusCode = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppException';
  }
}
