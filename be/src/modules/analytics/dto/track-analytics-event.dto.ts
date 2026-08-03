import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { Prisma } from '@prisma/client';
import { trimToUndefined } from '@common/utils';

export class TrackAnalyticsEventDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(200)
  path?: string;

  @IsOptional()
  @IsObject()
  metadata?: Prisma.InputJsonValue;
}
