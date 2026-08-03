import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import configuration from '@config/configuration';
import { PrismaModule } from '@database/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { CertificatesModule } from '@modules/certificates/certificates.module';
import { SkillsModule } from '@modules/skills/skills.module';
import { ExperiencesModule } from '@modules/experiences/experiences.module';
import { EducationModule } from '@modules/education/education.module';
import { ContactsModule } from '@modules/contacts/contacts.module';
import { AiModule } from '@modules/ai/ai.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { ResumeModule } from '@modules/resume/resume.module';
import { InterviewsModule } from '@modules/interviews/interviews.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { UploadsModule } from '@modules/uploads/uploads.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: configuration,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ProjectsModule,
    CertificatesModule,
    SkillsModule,
    ExperiencesModule,
    EducationModule,
    ContactsModule,
    AiModule,
    PaymentsModule,
    AnalyticsModule,
    ResumeModule,
    InterviewsModule,
    NotificationsModule,
    UploadsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
