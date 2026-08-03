import { Transform } from 'class-transformer';
import { IsArray, IsString, MaxLength } from 'class-validator';
import { trimToUndefined } from '@common/utils';

export class SubmitInterviewAnswersDto {
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  @IsArray()
  answers!: Array<{
    questionIndex: number;
    answer: string;
  }>;
}
