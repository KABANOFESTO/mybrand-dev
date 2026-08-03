import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AuthService } from '../auth.service';
import {
  JwtAccessPayload,
  PublicUser,
} from '../interfaces/auth.interfaces';
function cookieOrBearerExtractor(cookieName: string) {
  return (req: Request): string | null => {
    if (!req) {
      return null;
    }

    const cookieToken = req.cookies?.[cookieName];
    if (cookieToken) {
      return cookieToken;
    }

    return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const accessTokenCookieName = configService.get<string>(
      'auth.cookie.accessTokenName',
      'access_token',
    );

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[accessTokenCookieName] ?? null,
        cookieOrBearerExtractor(accessTokenCookieName),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'jwt.secret',
        'change-me-in-production',
      ),
    });
  }

  async validate(payload: JwtAccessPayload): Promise<PublicUser> {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return this.authService.validateJwtUser(payload.sub);
  }
}
