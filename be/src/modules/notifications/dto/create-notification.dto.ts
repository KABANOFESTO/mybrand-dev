import { Transform } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { Prisma, NotificationType } from '@prisma/client';
import { trimToUndefined } from '@common/utils';

export class CreateNotificationDto {
  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(200)
  userId?: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(160)
  title!: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(5000)
  body!: string;

  @IsOptional()
  @IsObject()
  metadata?: Prisma.InputJsonValue;
}
