import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, RolesGuard],
  exports: [NotificationsService],
})
export class NotificationsModule {}
