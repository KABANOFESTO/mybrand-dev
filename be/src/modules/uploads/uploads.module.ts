import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [PrismaModule],
  controllers: [UploadsController],
  providers: [UploadsService, JwtAuthGuard, RolesGuard],
  exports: [UploadsService],
})
export class UploadsModule {}
