import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { SaveProfileDto } from './dto/save-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('public/:userId')
  async getPublicProfile(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    const profile = await this.profilesService.getPublicProfile(userId);

    return buildApiResponse('Profile loaded successfully', profile);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: PublicUser) {
    const profile = await this.profilesService.getMyProfile(user.id);

    return buildApiResponse('Profile loaded successfully', profile);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async saveMyProfile(
    @CurrentUser() user: PublicUser,
    @Body() dto: SaveProfileDto,
  ) {
    const profile = await this.profilesService.saveMyProfile(user.id, dto);

    return buildApiResponse('Profile saved successfully', profile);
  }

  @Get('summary/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getProfileSummary(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    const profile = await this.profilesService.getProfileSummary(userId);

    return buildApiResponse('Profile summary loaded successfully', profile);
  }
}
