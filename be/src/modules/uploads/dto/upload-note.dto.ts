import { Transform } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

function trimToUndefined(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export class UploadNoteDto {
  @Transform(({ value }) => trimToUndefined(value))
  @IsString()
  @MaxLength(200)
  note?: string;
}
