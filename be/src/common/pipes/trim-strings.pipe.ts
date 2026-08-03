import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

function trimDeep(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => trimDeep(item));
  }

  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, trimDeep(item)]),
    );
  }

  return value;
}

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: unknown) {
    try {
      return trimDeep(value);
    } catch {
      throw new BadRequestException('Invalid request payload');
    }
  }
}
