import { AppErrorCode } from '@common/enums/app-error-code.enum';

export interface ApiErrorDetails {
  code: AppErrorCode;
  path: string;
  method: string;
  requestId?: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  error: ApiErrorDetails;
  timestamp: string;
}
