import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

function trimToUndefined(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export class SaveProfileDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(140)
  headline?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(5000)
  about?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'website must be a valid URL' })
  @MaxLength(255)
  website?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'github must be a valid URL' })
  @MaxLength(255)
  github?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'linkedin must be a valid URL' })
  @MaxLength(255)
  linkedin?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'resumeUrl must be a valid URL' })
  @MaxLength(255)
  resumeUrl?: string;
}
