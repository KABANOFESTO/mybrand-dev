import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

@Module({
  imports: [PrismaModule],
  controllers: [CertificatesController],
  providers: [CertificatesService, RolesGuard],
  exports: [CertificatesService],
})
export class CertificatesModule {}
