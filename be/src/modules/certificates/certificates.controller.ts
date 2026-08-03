import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  async listCertificates() {
    const certificates = await this.certificatesService.listCertificates();
    return buildApiResponse('Certificates loaded successfully', certificates);
  }

  @Get(':id')
  async getCertificate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const certificate = await this.certificatesService.getCertificateById(id);
    return buildApiResponse('Certificate loaded successfully', certificate);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async createCertificate(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateCertificateDto,
  ) {
    const certificate = await this.certificatesService.createCertificate(user, dto);
    return buildApiResponse('Certificate created successfully', certificate);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async updateCertificate(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCertificateDto,
  ) {
    const certificate = await this.certificatesService.updateCertificate(user, id, dto);
    return buildApiResponse('Certificate updated successfully', certificate);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async deleteCertificate(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.certificatesService.deleteCertificate(user, id);
    return buildApiResponse('Certificate deleted successfully', result);
  }
}
