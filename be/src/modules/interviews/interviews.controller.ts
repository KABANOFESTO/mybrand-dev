import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CreateInterviewSessionDto } from './dto/create-interview-session.dto';
import { SubmitInterviewAnswersDto } from './dto/submit-interview-answers.dto';
import { GenerateInterviewFeedbackDto } from './dto/generate-interview-feedback.dto';
import { InterviewsService } from './interviews.service';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get('templates')
  @UseGuards(JwtAuthGuard)
  async getTemplates() {
    const templates = this.interviewsService.getTemplates();
    return buildApiResponse('Interview templates loaded successfully', templates);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getSummary() {
    const summary = await this.interviewsService.getSummary();
    return buildApiResponse('Interview summary loaded successfully', summary);
  }

  @Post('me/sessions')
  @UseGuards(JwtAuthGuard)
  async createSession(@CurrentUser() user: PublicUser, @Body() dto: CreateInterviewSessionDto) {
    const session = await this.interviewsService.createSession(user, dto);
    return buildApiResponse('Interview session created successfully', session);
  }

  @Get('me/sessions')
  @UseGuards(JwtAuthGuard)
  async listMySessions(@CurrentUser() user: PublicUser) {
    const sessions = await this.interviewsService.listMySessions(user.id);
    return buildApiResponse('Interview sessions loaded successfully', sessions);
  }

  @Get('me/sessions/:id')
  @UseGuards(JwtAuthGuard)
  async getMySession(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const session = await this.interviewsService.getMySession(user.id, id);
    return buildApiResponse('Interview session loaded successfully', session);
  }

  @Patch('me/sessions/:id/answers')
  @UseGuards(JwtAuthGuard)
  async submitAnswers(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: SubmitInterviewAnswersDto,
  ) {
    const session = await this.interviewsService.submitAnswers(user.id, id, dto);
    return buildApiResponse('Interview answers saved successfully', session);
  }

  @Post('me/sessions/:id/feedback')
  @UseGuards(JwtAuthGuard)
  async generateFeedback(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: GenerateInterviewFeedbackDto,
  ) {
    const session = await this.interviewsService.generateFeedback(user.id, id, dto);
    return buildApiResponse('Interview feedback generated successfully', session);
  }

  @Delete('me/sessions/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSession(
    @CurrentUser() user: PublicUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.interviewsService.deleteSession(user.id, id);
    return buildApiResponse('Interview session deleted successfully', result);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async listAllSessions() {
    const sessions = await this.interviewsService.listAllSessions();
    return buildApiResponse('Interview sessions loaded successfully', sessions);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getSessionForAdmin(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const session = await this.interviewsService.getSessionForAdmin(id);
    return buildApiResponse('Interview session loaded successfully', session);
  }
}
