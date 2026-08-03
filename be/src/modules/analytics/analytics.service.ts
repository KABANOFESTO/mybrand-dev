import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { TrackAnalyticsEventDto } from './dto/track-analytics-event.dto';
import type { AnalyticsEventView, AnalyticsSummaryView, AnalyticsTrackResult } from './interfaces/analytics.interfaces';

const ANALYTICS_EVENT_SELECT = {
  id: true,
  name: true,
  path: true,
  ipAddress: true,
  userAgent: true,
  metadata: true,
  createdAt: true,
  userId: true,
} as const satisfies Prisma.AnalyticsEventSelect;

type AnalyticsEventEntity = Prisma.AnalyticsEventGetPayload<{ select: typeof ANALYTICS_EVENT_SELECT }>;

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackEvent(
    dto: TrackAnalyticsEventDto,
    requestMeta?: { userId?: string; ipAddress?: string | null; userAgent?: string | null },
  ): Promise<AnalyticsTrackResult> {
    const event = await this.prisma.analyticsEvent.create({
      data: {
        name: this.normalizeRequiredText(dto.name),
        path: this.normalizeOptionalText(dto.path),
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
        userId: requestMeta?.userId ?? null,
        ipAddress: requestMeta?.ipAddress ?? null,
        userAgent: requestMeta?.userAgent ?? null,
      },
      select: ANALYTICS_EVENT_SELECT,
    });

    return { tracked: true, event: this.toView(event) };
  }

  async listMyEvents(userId: string, limit = 50): Promise<AnalyticsEventView[]> {
    const events = await this.prisma.analyticsEvent.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
      select: ANALYTICS_EVENT_SELECT,
    });

    return events.map((event) => this.toView(event));
  }

  async getSummary(days = 30): Promise<AnalyticsSummaryView> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalEvents, trackedUsers, topEvents, topPaths, recentEvents] = await Promise.all([      this.prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
      this.prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since }, userId: { not: null } },
        distinct: ['userId'],
        select: { userId: true },
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['name'],
        where: { createdAt: { gte: since } },
        _count: { name: true },
        orderBy: { _count: { name: 'desc' } },
        take: 8,
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['path'],
        where: { createdAt: { gte: since }, path: { not: null } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 8,
      }),
      this.prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: [{ createdAt: 'desc' }],
        take: 10,
        select: ANALYTICS_EVENT_SELECT,
      }),
    ]);

    return {
      totalEvents,
      trackedUsers: trackedUsers.length,
      topEvents: topEvents.map((item) => ({ name: item.name, count: item._count.name })),
      topPaths: topPaths
        .filter((item): item is typeof item & { path: string } => Boolean(item.path))
        .map((item) => ({ path: item.path, count: item._count.path })),
      recentEvents: recentEvents.map((event) => this.toView(event)),
    };
  }

  private normalizeRequiredText(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException('Event name is required');
    }

    return normalized;
  }

  private normalizeOptionalText(value?: string | null) {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private toView(event: AnalyticsEventEntity): AnalyticsEventView {
    return {
      id: event.id,
      name: event.name,
      path: event.path,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      metadata: (event.metadata as Record<string, unknown> | null) ?? null,
      createdAt: event.createdAt,
      userId: event.userId,
    };
  }
}
