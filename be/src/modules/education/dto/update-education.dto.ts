import { Transform } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

function trimToUndefined(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toDateOrUndefined(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? value : date;
}

export class UpdateEducationDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(180)
  institution?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  degree?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  field?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  score?: string;

  @IsOptional()
  @Transform(({ value }) => toDateOrUndefined(value))
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => toDateOrUndefined(value))
  @IsDate()
  endDate?: Date;
}
