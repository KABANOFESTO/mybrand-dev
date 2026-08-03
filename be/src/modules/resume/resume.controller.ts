import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyResume(@CurrentUser() user: PublicUser) {
    const resume = await this.resumeService.getMyResume(user.id);
    return buildApiResponse('Resume loaded successfully', resume);
  }

  @Post('me/generate')
  @UseGuards(JwtAuthGuard)
  async generateMyResume(@CurrentUser() user: PublicUser, @Body() dto: GenerateResumeDto) {
    const resume = await this.resumeService.generateMyResume(user.id, dto);
    return buildApiResponse('Resume generated successfully', resume);
  }

  @Get('public/:userId')
  async getPublicResume(@Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string) {
    const resume = await this.resumeService.getPublicResume(userId);
    return buildApiResponse('Public resume loaded successfully', resume);
  }
}
