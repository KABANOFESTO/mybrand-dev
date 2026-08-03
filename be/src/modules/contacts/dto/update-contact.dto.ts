import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContactStatus } from '@prisma/client';

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

export class UpdateContactDto {
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(5000)
  adminNote?: string;

  @IsOptional()
  @Transform(({ value }) => toDateOrUndefined(value))
  @IsDate()
  respondedAt?: Date;
}

