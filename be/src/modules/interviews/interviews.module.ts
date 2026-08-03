import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { AiModule } from '@modules/ai/ai.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

@Module({
  imports: [PrismaModule, AiModule, NotificationsModule, AnalyticsModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, RolesGuard],
  exports: [InterviewsService],
})
export class InterviewsModule {}
