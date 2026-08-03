import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { AiModule } from '@modules/ai/ai.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

@Module({
  imports: [PrismaModule, AiModule, NotificationsModule, AnalyticsModule],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
