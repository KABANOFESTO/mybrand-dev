import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExperiencesController],
  providers: [ExperiencesService, RolesGuard],
  exports: [ExperiencesService],
})
export class ExperiencesModule {}
