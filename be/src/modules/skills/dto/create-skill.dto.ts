import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, MaxLength, MinLength } from 'class-validator';
import { SkillCategory } from '@prisma/client';

function trimToUndefined(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toNumberOrUndefined(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}

export class CreateSkillDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEnum(SkillCategory)
  category!: SkillCategory;

  @Transform(({ value }) => toNumberOrUndefined(value))
  @IsInt()
  @Min(0)
  @Max(100)
  proficiency!: number;

  @IsOptional()
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(80)
  icon?: string;

  @IsOptional()
  @Transform(({ value }) => toNumberOrUndefined(value))
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
