import { ApiResponse } from '@common/interfaces/api-response.interface';

export function buildApiResponse<T>(
  message: string,
  data: T,
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}
