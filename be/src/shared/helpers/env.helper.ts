type PostgresConnectionInput = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export function envBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export function envNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function envList(value: string | undefined, fallback: string[]) {
  if (!value) {
    return fallback;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildPostgresUrl({
  host,
  port,
  username,
  password,
  database,
}: PostgresConnectionInput) {
  const encodedPassword = encodeURIComponent(password);

  return `postgresql://${username}:${encodedPassword}@${host}:${port}/${database}?schema=public`;
}
