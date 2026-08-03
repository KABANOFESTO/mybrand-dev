import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import { ListNotificationsAdminQueryDto } from './dto/list-notifications-admin-query.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async listMyNotifications(@CurrentUser() user: PublicUser, @Query() query: ListNotificationsQueryDto) {
    const notifications = await this.notificationsService.listMyNotifications(user.id, query.unreadOnly ?? false);
    return buildApiResponse('Notifications loaded successfully', notifications);
  }

  @Patch('me/read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@CurrentUser() user: PublicUser) {
    const result = await this.notificationsService.markAllAsRead(user.id);
    return buildApiResponse('Notifications marked as read', result);
  }

  @Patch('me/:id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const notification = await this.notificationsService.markAsRead(user.id, id);
    return buildApiResponse('Notification marked as read', notification);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async listAllNotifications(@Query() query: ListNotificationsAdminQueryDto) {
    const notifications = await this.notificationsService.listAllNotifications({
      unreadOnly: query.unreadOnly,
      archivedOnly: query.archivedOnly,
    });
    return buildApiResponse('Notifications loaded successfully', notifications);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  async createNotification(@Body() dto: CreateNotificationDto) {
    const notification = await this.notificationsService.createNotification(dto);
    return buildApiResponse('Notification created successfully', notification);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async deleteNotification(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.notificationsService.deleteNotification(id);
    return buildApiResponse('Notification deleted successfully', result);
  }
}
