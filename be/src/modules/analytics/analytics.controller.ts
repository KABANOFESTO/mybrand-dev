import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { TrackAnalyticsEventDto } from './dto/track-analytics-event.dto';
import { AnalyticsSummaryQueryDto } from './dto/analytics-summary-query.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  async trackEvent(
    @Body() dto: TrackAnalyticsEventDto,
    @Req() request: Request,
    @CurrentUser() user?: PublicUser,
  ) {
    const result = await this.analyticsService.trackEvent(dto, {
      userId: user?.id,
      ipAddress: this.getClientIp(request),
      userAgent: request.header('user-agent') ?? null,
    });

    return buildApiResponse('Analytics event tracked successfully', result);
  }

  @Get('events/me')
  @UseGuards(JwtAuthGuard)
  async listMyEvents(@CurrentUser() user: PublicUser) {
    const events = await this.analyticsService.listMyEvents(user.id);
    return buildApiResponse('Analytics events loaded successfully', events);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getSummary(@Query() query: AnalyticsSummaryQueryDto) {
    const summary = await this.analyticsService.getSummary(query.days ?? 30);
    return buildApiResponse('Analytics summary loaded successfully', summary);
  }

  private getClientIp(request: Request) {
    const forwarded = request.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwarded)
      ? forwarded[0]
      : typeof forwarded === 'string'
        ? forwarded.split(',')[0]
        : undefined;

    return forwardedIp?.trim() || request.ip || null;
  }
}
