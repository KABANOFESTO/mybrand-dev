import { UserRole } from '@prisma/client';

export const AUTH_ROLES_KEY = 'auth:roles';

export const AUTH_COOKIE_NAMES = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
} as const;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  VISITOR: 0,
  RECRUITER: 1,
  ADMIN: 2,
  OWNER: 3,
};
