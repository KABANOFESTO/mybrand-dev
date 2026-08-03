import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { GenerateResumeAiDto } from './dto/generate-resume-ai.dto';
import { GenerateSkillAnalysisDto } from './dto/generate-skill-analysis.dto';
import { GenerateInterviewDto } from './dto/generate-interview.dto';
import { GenerateCodeReviewDto } from './dto/generate-code-review.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('reports/me')
  @UseGuards(JwtAuthGuard)
  async listMyReports(@CurrentUser() user: PublicUser) {
    const reports = await this.aiService.listMyReports(user.id);
    return buildApiResponse('AI reports loaded successfully', reports);
  }

  @Get('reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async listAllReports() {
    const reports = await this.aiService.listAllReports();
    return buildApiResponse('AI reports loaded successfully', reports);
  }

  @Get('reports/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getReportById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const report = await this.aiService.getReportById(id);
    return buildApiResponse('AI report loaded successfully', report);
  }

  @Post('resume-draft')
  @UseGuards(JwtAuthGuard)
  async generateResumeDraft(@CurrentUser() user: PublicUser, @Body() dto: GenerateResumeAiDto) {
    const result = await this.aiService.generateResumeDraft(dto, { userId: user.id });
    return buildApiResponse('Resume draft generated successfully', result);
  }

  @Post('skill-analysis')
  @UseGuards(JwtAuthGuard)
  async analyzeSkills(@CurrentUser() user: PublicUser, @Body() dto: GenerateSkillAnalysisDto) {
    const result = await this.aiService.analyzeSkills(dto, { userId: user.id });
    return buildApiResponse('Skill analysis generated successfully', result);
  }

  @Post('interview-simulation')
  @UseGuards(JwtAuthGuard)
  async simulateInterview(@CurrentUser() user: PublicUser, @Body() dto: GenerateInterviewDto) {
    const result = await this.aiService.simulateInterview(dto, { userId: user.id });
    return buildApiResponse('Interview simulation generated successfully', result);
  }

  @Post('code-review')
  @UseGuards(JwtAuthGuard)
  async reviewCode(@CurrentUser() user: PublicUser, @Body() dto: GenerateCodeReviewDto) {
    const result = await this.aiService.reviewCode(dto, { userId: user.id });
    return buildApiResponse('Code review generated successfully', result);
  }
}
