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
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async listEducation() {
    const education = await this.educationService.listEducation();
    return buildApiResponse('Education loaded successfully', education);
  }

  @Get(':id')
  async getEducation(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const education = await this.educationService.getEducationById(id);
    return buildApiResponse('Education loaded successfully', education);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async createEducation(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateEducationDto,
  ) {
    const education = await this.educationService.createEducation(user, dto);
    return buildApiResponse('Education created successfully', education);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async updateEducation(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    const education = await this.educationService.updateEducation(user, id, dto);
    return buildApiResponse('Education updated successfully', education);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async deleteEducation(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.educationService.deleteEducation(user, id);
    return buildApiResponse('Education deleted successfully', result);
  }
}
