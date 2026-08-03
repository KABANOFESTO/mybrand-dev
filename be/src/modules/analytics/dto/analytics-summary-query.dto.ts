import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, Max, Min } from 'class-validator';
import { parseBoolean } from '@common/utils';

function toOptionalInt(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : value;
}

export class AnalyticsSummaryQueryDto {
  @IsOptional()
  @Transform(({ value }) => toOptionalInt(value))
  @Min(1)
  @Max(365)
  days?: number;
}
