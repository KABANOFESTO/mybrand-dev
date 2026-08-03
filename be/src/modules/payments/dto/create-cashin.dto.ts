import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { trimToUndefined } from '@common/utils';

export class CreateCashinDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount!: number;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(20)
  number!: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  label?: string;
}
