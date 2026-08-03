import { Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { trimToUndefined } from '@common/utils';

export class CheckoutItemDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateCheckoutDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsEmail()
  email?: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  label?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items!: CheckoutItemDto[];
}
