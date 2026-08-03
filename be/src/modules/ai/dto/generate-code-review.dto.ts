import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { trimToUndefined } from '@common/utils';

export class GenerateCodeReviewDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(50000)
  code!: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  language?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(250)
  context?: string;
}
