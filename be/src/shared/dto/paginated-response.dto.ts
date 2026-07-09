import { PaginatedResult } from '../types/paginated-result.type';

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginatedResult<T>['meta'];
}
