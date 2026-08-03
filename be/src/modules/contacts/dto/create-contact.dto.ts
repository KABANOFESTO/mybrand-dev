import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { trimToUndefined } from '@common/utils';

export class CreateContactDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsEmail()
  @MaxLength(160)
  email!: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  subject!: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  message!: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  source?: string;
}
