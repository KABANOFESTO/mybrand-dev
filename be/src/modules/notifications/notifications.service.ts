import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import type { NotificationDeleteResult, NotificationView } from './interfaces/notification.interfaces';

const NOTIFICATION_SELECT = {
  id: true,
  type: true,
  title: true,
  body: true,
  metadata: true,
  readAt: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
} as const satisfies Prisma.NotificationSelect;

type NotificationEntity = Prisma.NotificationGetPayload<{ select: typeof NOTIFICATION_SELECT }>;

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(dto: CreateNotificationDto): Promise<NotificationView> {
    if (!dto.userId) {
      throw new BadRequestException('userId is required for notifications');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new BadRequestException('Invalid user account');
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: this.normalizeRequiredText(dto.title),
        body: this.normalizeRequiredText(dto.body),
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
      select: NOTIFICATION_SELECT,
    });

    return this.toView(notification);
  }

  async sendUserNotification(
    userId: string,
    dto: Omit<CreateNotificationDto, 'userId'>,
  ): Promise<NotificationView> {
    return this.createNotification({ ...dto, userId });
  }

  async listMyNotifications(userId: string, unreadOnly = false): Promise<NotificationView[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
      select: NOTIFICATION_SELECT,
    });

    return notifications.map((notification) => this.toView(notification));
  }

  async listAllNotifications(params?: { unreadOnly?: boolean; archivedOnly?: boolean }): Promise<NotificationView[]> {
    const where: Prisma.NotificationWhereInput = {};

    if (params?.unreadOnly) {
      where.readAt = null;
    } else if (params?.archivedOnly) {
      where.readAt = { not: null };
    }

    const notifications = await this.prisma.notification.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      select: NOTIFICATION_SELECT,
    });

    return notifications.map((notification) => this.toView(notification));
  }

  async markAsRead(userId: string, notificationId: string): Promise<NotificationView> {
    const notification = await this.findNotificationOrThrow(notificationId);

    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this notification');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: notification.readAt ?? new Date() },
      select: NOTIFICATION_SELECT,
    });

    return this.toView(updated);
  }

  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });

    return { updated: result.count };
  }

  async deleteNotification(notificationId: string): Promise<NotificationDeleteResult> {
    await this.findNotificationOrThrow(notificationId);
    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { deleted: true };
  }

  private async findNotificationOrThrow(notificationId: string): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
      select: NOTIFICATION_SELECT,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  private normalizeRequiredText(value: string) {
    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException('Required fields cannot be empty');
    }

    return normalized;
  }

  private toView(notification: NotificationEntity): NotificationView {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      metadata: (notification.metadata as Record<string, unknown> | null) ?? null,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      userId: notification.userId,
    };
  }
}
