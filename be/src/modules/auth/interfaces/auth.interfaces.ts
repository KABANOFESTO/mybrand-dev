import { UserRole } from '@prisma/client';

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtAccessPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JwtRefreshPayload extends JwtAccessPayload {
  jti: string;
  type: 'refresh';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export interface AuthSession {
  user: PublicUser;
  tokens: AuthTokens;
}

export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}
