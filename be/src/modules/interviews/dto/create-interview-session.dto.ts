import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { trimToUndefined, splitToStringArray } from '@common/utils';

export class CreateInterviewSessionDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  role!: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @IsIn(['JUNIOR', 'MID', 'SENIOR'])
  difficulty!: 'JUNIOR' | 'MID' | 'SENIOR';

  @IsOptional()
  @Transform(({ value }) => splitToStringArray(value))
  @IsArray()
  @IsString({ each: true })
  focusAreas?: string[];

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(60)
  templateKey?: string;
}
