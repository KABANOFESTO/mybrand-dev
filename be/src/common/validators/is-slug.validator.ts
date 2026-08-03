import { registerDecorator, ValidationOptions } from 'class-validator';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSlug',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && SLUG_PATTERN.test(value.trim());
        },
        defaultMessage() {
          return 'slug must contain only lowercase letters, numbers, and hyphens';
        },
      },
    });
  };
}
