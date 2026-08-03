import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { File as MulterFile } from 'multer';
import { UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { buildUploadMulterOptions } from './helpers/upload-storage.helper';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', buildUploadMulterOptions('avatar', 5 * 1024 * 1024)))
  async uploadAvatar(@CurrentUser() _user: PublicUser, @UploadedFile() file: MulterFile) {
    const upload = this.uploadsService.storeFile('avatar', file);
    return buildApiResponse('Avatar uploaded successfully', upload);
  }

  @Post('resume')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', buildUploadMulterOptions('resume', 10 * 1024 * 1024)))
  async uploadResume(@CurrentUser() _user: PublicUser, @UploadedFile() file: MulterFile) {
    const upload = this.uploadsService.storeFile('resume', file);
    return buildApiResponse('Resume uploaded successfully', upload);
  }

  @Post('project-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', buildUploadMulterOptions('project-image', 8 * 1024 * 1024)))
  async uploadProjectImage(@UploadedFile() file: MulterFile) {
    const upload = this.uploadsService.storeFile('project-image', file);
    return buildApiResponse('Project image uploaded successfully', upload);
  }

  @Post('certificate-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', buildUploadMulterOptions('certificate-image', 8 * 1024 * 1024)))
  async uploadCertificateImage(@UploadedFile() file: MulterFile) {
    const upload = this.uploadsService.storeFile('certificate-image', file);
    return buildApiResponse('Certificate image uploaded successfully', upload);
  }

  @Post('certificate-pdf')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', buildUploadMulterOptions('certificate-pdf', 15 * 1024 * 1024)))
  async uploadCertificatePdf(@UploadedFile() file: MulterFile) {
    const upload = this.uploadsService.storeFile('certificate-pdf', file);
    return buildApiResponse('Certificate PDF uploaded successfully', upload);
  }
}
