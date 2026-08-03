import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [PrismaModule, NotificationsModule, AnalyticsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, RolesGuard],
  exports: [PaymentsService],
})
export class PaymentsModule {}
