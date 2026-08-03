import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, RolesGuard],
  exports: [ProfilesService],
})
export class ProfilesModule {}
