import { registerAs } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { envBoolean } from '@shared/helpers/env.helper';

const AUTH_COOKIE_SAME_SITE_VALUES = ['lax', 'strict', 'none'] as const;

function resolveSameSite(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return AUTH_COOKIE_SAME_SITE_VALUES.includes(
    normalized as (typeof AUTH_COOKIE_SAME_SITE_VALUES)[number],
  )
    ? (normalized as (typeof AUTH_COOKIE_SAME_SITE_VALUES)[number])
    : 'lax';
}

function resolveRole(value: string | undefined) {
  const roles = Object.values(UserRole) as string[];
  return roles.includes(value || '') ? (value as UserRole) : UserRole.OWNER;
}

export default registerAs('auth', () => ({
  cookie: {
    accessTokenName: process.env.AUTH_ACCESS_COOKIE_NAME || 'access_token',
    refreshTokenName: process.env.AUTH_REFRESH_COOKIE_NAME || 'refresh_token',
    secure: envBoolean(
      process.env.AUTH_COOKIE_SECURE,
      process.env.NODE_ENV === 'production',
    ),
    sameSite: resolveSameSite(process.env.AUTH_COOKIE_SAME_SITE),
    domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
    path: process.env.AUTH_COOKIE_PATH || '/',
  },
  bootstrap: {
    enabled: envBoolean(process.env.BOOTSTRAP_ADMIN_ENABLED, true),
    name: process.env.BOOTSTRAP_ADMIN_NAME || 'Portfolio Owner',
    email: process.env.BOOTSTRAP_ADMIN_EMAIL || '',
    password: process.env.BOOTSTRAP_ADMIN_PASSWORD || '',
    role: resolveRole(process.env.BOOTSTRAP_ADMIN_ROLE),
  },
}));
