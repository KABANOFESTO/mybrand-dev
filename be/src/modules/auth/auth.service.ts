import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, UserRole } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import type { Response } from 'express';
import type { Request } from 'express';
import { PrismaService } from '@database/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthResponse,
  AuthSession,
  AuthTokens,
  JwtAccessPayload,
  JwtRefreshPayload,
  PublicUser,
} from './interfaces/auth.interfaces';
import { AUTH_COOKIE_NAMES } from '@common/constants/auth.constants';

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
  isActive: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

const AUTH_USER_SELECT = {
  ...PUBLIC_USER_SELECT,
  passwordHash: true,
} as const satisfies Prisma.UserSelect;

type PublicUserEntity = Prisma.UserGetPayload<{
  select: typeof PUBLIC_USER_SELECT;
}>;

type AuthUserEntity = Prisma.UserGetPayload<{
  select: typeof AUTH_USER_SELECT;
}>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSession> {
    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
        role: UserRole.VISITOR,
      },
      select: AUTH_USER_SELECT,
    });

    return this.createSession(user);
  }

  async login(dto: LoginDto): Promise<AuthSession> {
    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: AUTH_USER_SELECT,
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createSession(user);
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    const payload = await this.verifyRefreshToken(refreshToken);

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });

    if (
      !tokenRecord ||
      tokenRecord.revokedAt ||
      tokenRecord.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      tokenRecord.tokenHash,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const user = await this.getActiveUserById(payload.sub);

    await this.prisma.refreshToken.delete({
      where: { jti: payload.jti },
    });

    return this.createSession(user);
  }

  async logout(refreshToken?: string): Promise<{ loggedOut: boolean }> {
    if (!refreshToken) {
      return { loggedOut: true };
    }

    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      await this.prisma.refreshToken.deleteMany({
        where: { jti: payload.jti },
      });
    } catch (error) {
      this.logger.debug('Skipping refresh token revocation during logout');
    }

    return { loggedOut: true };
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await this.getActiveUserById(userId);
    return this.toPublicUser(user);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  toAuthResponse(session: AuthSession): AuthResponse {
    return {
      user: session.user,
      accessToken: session.tokens.accessToken,
      tokenType: 'Bearer',
      expiresIn: session.tokens.accessExpiresIn,
    };
  }

  setAuthCookies(res: Response, tokens: AuthTokens) {
    const cookieOptions = this.getCookieOptions();

    res.cookie(this.getAccessTokenCookieName(), tokens.accessToken, {
      ...cookieOptions,
      maxAge: this.durationToMs(tokens.accessExpiresIn),
    });
    res.cookie(this.getRefreshTokenCookieName(), tokens.refreshToken, {
      ...cookieOptions,
      maxAge: this.durationToMs(tokens.refreshExpiresIn),
    });
  }

  clearAuthCookies(res: Response) {
    const cookieOptions = this.getCookieOptions();

    res.clearCookie(this.getAccessTokenCookieName(), cookieOptions);
    res.clearCookie(this.getRefreshTokenCookieName(), cookieOptions);
  }

  getRefreshTokenFromRequest(request: Request) {
    return request.cookies?.[this.getRefreshTokenCookieName()];
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtRefreshPayload> {
    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      this.configService.get<string>('jwt.secret', 'change-me-in-production'),
    );

    const payload = await this.jwtService.verifyAsync<JwtRefreshPayload>(
      refreshToken,
      {
        secret: refreshSecret,
      },
    );

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    return payload;
  }

  async validateJwtUser(userId: string): Promise<PublicUser> {
    return this.getCurrentUser(userId);
  }

  private async createSession(user: AuthUserEntity): Promise<AuthSession> {
    const publicUser = this.toPublicUser(user);
    const tokens = await this.generateTokens(publicUser);

    return {
      user: publicUser,
      tokens,
    };
  }

  private async generateTokens(user: PublicUser): Promise<AuthTokens> {
    const accessExpiresIn = this.configService.get<string>(
      'jwt.expiresIn',
      '15m',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );
    const accessSecret = this.configService.get<string>(
      'jwt.secret',
      'change-me-in-production',
    );
    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      accessSecret,
    );
    const jti = randomUUID();

    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const refreshPayload: JwtRefreshPayload = {
      ...accessPayload,
      jti,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn as any,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn as any,
      }),
    ]);

    const tokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.refreshToken.create({
      data: {
        jti,
        tokenHash,
        userId: user.id,
        expiresAt: this.calculateExpiry(refreshExpiresIn),
      },
    });

    return {
      accessToken,
      refreshToken,
      accessExpiresIn,
      refreshExpiresIn,
    };
  }

  private async getActiveUserById(userId: string): Promise<AuthUserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: AUTH_USER_SELECT,
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is not active');
    }

    return user;
  }

  private toPublicUser(user: PublicUserEntity | AuthUserEntity): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get<boolean>(
        'auth.cookie.secure',
        process.env.NODE_ENV === 'production',
      ),
      sameSite: this.configService.get<'lax' | 'strict' | 'none'>(
        'auth.cookie.sameSite',
        'lax',
      ),
      domain: this.configService.get<string | undefined>(
        'auth.cookie.domain',
      ),
      path: this.configService.get<string>('auth.cookie.path', '/'),
    } as const;
  }

  private getAccessTokenCookieName() {
    return this.configService.get<string>(
      'auth.cookie.accessTokenName',
      AUTH_COOKIE_NAMES.accessToken,
    );
  }

  private getRefreshTokenCookieName() {
    return this.configService.get<string>(
      'auth.cookie.refreshTokenName',
      AUTH_COOKIE_NAMES.refreshToken,
    );
  }

  private durationToMs(duration: string): number {
    const normalized = duration.trim().toLowerCase();
    const match = normalized.match(/^(\d+)(ms|s|m|h|d)?$/);

    if (!match) {
      return 0;
    }

    const value = Number(match[1]);
    const unit = match[2] || 'ms';

    switch (unit) {
      case 'ms':
        return value;
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }

  private calculateExpiry(duration: string) {
    const expiresInMs = this.durationToMs(duration);
    return new Date(Date.now() + expiresInMs);
  }
}
