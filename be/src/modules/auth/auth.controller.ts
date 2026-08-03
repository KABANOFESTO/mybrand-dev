import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { PublicUser } from './interfaces/auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.authService.register(dto);
    this.authService.setAuthCookies(res, session.tokens);

    return buildApiResponse(
      'Account created successfully',
      this.authService.toAuthResponse(session),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.authService.login(dto);
    this.authService.setAuthCookies(res, session.tokens);

    return buildApiResponse(
      'Login successful',
      this.authService.toAuthResponse(session),
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = this.authService.getRefreshTokenFromRequest(req);
    const session = await this.authService.refresh(refreshToken);
    this.authService.setAuthCookies(res, session.tokens);

    return buildApiResponse(
      'Session refreshed successfully',
      this.authService.toAuthResponse(session),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(
      this.authService.getRefreshTokenFromRequest(req),
    );
    this.authService.clearAuthCookies(res);

    return buildApiResponse('Logged out successfully', {
      loggedOut: true,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: PublicUser) {
    return buildApiResponse('Current user loaded successfully', user);
  }
}
