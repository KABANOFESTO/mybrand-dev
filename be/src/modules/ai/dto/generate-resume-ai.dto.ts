import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { splitToStringArray, trimToUndefined } from '@common/utils';

export class GenerateResumeAiDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  targetRole?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(80)
  tone?: string;

  @IsOptional()
  @Transform(({ value }) => splitToStringArray(value))
  @IsArray()
  @IsString({ each: true })
  focusKeywords?: string[];
}
