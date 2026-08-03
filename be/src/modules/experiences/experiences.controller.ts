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
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ExperiencesService } from './experiences.service';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  async listExperiences() {
    const experiences = await this.experiencesService.listExperiences();
    return buildApiResponse('Experiences loaded successfully', experiences);
  }

  @Get(':id')
  async getExperience(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const experience = await this.experiencesService.getExperienceById(id);
    return buildApiResponse('Experience loaded successfully', experience);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async createExperience(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateExperienceDto,
  ) {
    const experience = await this.experiencesService.createExperience(user, dto);
    return buildApiResponse('Experience created successfully', experience);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async updateExperience(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    const experience = await this.experiencesService.updateExperience(user, id, dto);
    return buildApiResponse('Experience updated successfully', experience);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async deleteExperience(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.experiencesService.deleteExperience(user, id);
    return buildApiResponse('Experience deleted successfully', result);
  }
}
