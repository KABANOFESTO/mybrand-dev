import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { parseBoolean } from '@common/utils';

export class ListPaymentsQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  pendingOnly?: boolean;
}
