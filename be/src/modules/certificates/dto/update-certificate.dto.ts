import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

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

export class UpdateCertificateDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  issuer?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  credentialId?: string;

  @IsOptional()
  @Transform(({ value }) => toDateOrUndefined(value))
  @IsDate()
  issuedAt?: Date;

  @IsOptional()
  @Transform(({ value }) => toDateOrUndefined(value))
  @IsDate()
  expiredAt?: Date;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'verificationUrl must be a valid URL' })
  @MaxLength(255)
  verificationUrl?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'pdfUrl must be a valid URL' })
  @MaxLength(255)
  pdfUrl?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'imageUrl must be a valid URL' })
  @MaxLength(255)
  imageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(120, { each: true })
  skills?: string[];
}
