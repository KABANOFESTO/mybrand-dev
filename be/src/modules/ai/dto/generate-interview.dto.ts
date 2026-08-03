import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { trimToUndefined } from '@common/utils';

export class GenerateInterviewDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  role?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @IsIn(['JUNIOR', 'MID', 'SENIOR'])
  difficulty?: 'JUNIOR' | 'MID' | 'SENIOR';
}
