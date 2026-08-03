import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
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

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'off'].includes(normalized)) {
      return false;
    }
  }

  return value;
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return value;
}

function toDateOrUndefined(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? value : date;
}

export class CreateExperienceDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  company!: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  role!: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  location?: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description!: string;

  @Transform(({ value }) => toDateOrUndefined(value))
  @IsDate()
  startDate!: Date;

  @IsOptional()
  @Transform(({ value }) => toDateOrUndefined(value))
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  current?: boolean;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(120, { each: true })
  technologies!: string[];
}
