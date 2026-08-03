import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  imports: [PrismaModule],
  controllers: [EducationController],
  providers: [EducationService, RolesGuard],
  exports: [EducationService],
})
export class EducationModule {}
