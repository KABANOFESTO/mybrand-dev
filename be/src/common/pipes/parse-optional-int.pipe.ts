import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform {
  transform(value: unknown) {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('Expected an integer value');
    }

    return parsed;
  }
}
