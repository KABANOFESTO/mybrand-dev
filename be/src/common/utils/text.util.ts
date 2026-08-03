export function trimToUndefined(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizeText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

export function normalizeSlug(value: unknown): string {
  const text = normalizeText(value).toLowerCase();
  return text.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function splitToStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => normalizeText(item))
      .filter((item) => item.length > 0);
  }

  return [];
}

export function parseBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return undefined;
}

export function parseDateOrUndefined(value: unknown): Date | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function isEmptyObject(value: unknown): value is Record<string, never> {
  return Boolean(value) && typeof value === 'object' && Object.keys(value as object).length === 0;
}
