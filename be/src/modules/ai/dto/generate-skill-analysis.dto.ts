import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { splitToStringArray, trimToUndefined } from '@common/utils';

export class GenerateSkillAnalysisDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  targetRole?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  currentRole?: string;

  @IsOptional()
  @Transform(({ value }) => splitToStringArray(value))
  @IsArray()
  @IsString({ each: true })
  focusSkills?: string[];
}
