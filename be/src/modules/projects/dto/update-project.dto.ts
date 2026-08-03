import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsSlug } from '@common/validators/is-slug.validator';
import { parseBoolean, parseDateOrUndefined, splitToStringArray, trimToUndefined } from '@common/utils';
import { ProjectStatus } from '@prisma/client';


export class UpdateProjectDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'repositoryUrl must be a valid URL' })
  @MaxLength(255)
  repositoryUrl?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'liveUrl must be a valid URL' })
  @MaxLength(255)
  liveUrl?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsUrl({ require_tld: false }, { message: 'imageUrl must be a valid URL' })
  @MaxLength(255)
  imageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => parseBoolean(value))
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @Transform(({ value }) => splitToStringArray(value))
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(120, { each: true })
  technologies?: string[];

  @IsOptional()
  @Transform(({ value }) => splitToStringArray(value))
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(240, { each: true })
  features?: string[];

  @IsOptional()
  @Transform(({ value }) => parseDateOrUndefined(value))
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => parseDateOrUndefined(value))
  @IsDate()
  endDate?: Date;
}





