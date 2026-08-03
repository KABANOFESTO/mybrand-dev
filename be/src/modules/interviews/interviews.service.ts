import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, InterviewDifficulty, NotificationType } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { AiService } from '@modules/ai/ai.service';
import type { InterviewSimulationAiResult } from '@modules/ai/interfaces/ai.interfaces';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateInterviewSessionDto } from './dto/create-interview-session.dto';
import { SubmitInterviewAnswersDto } from './dto/submit-interview-answers.dto';
import { GenerateInterviewFeedbackDto } from './dto/generate-interview-feedback.dto';
import type {
  InterviewSessionDeleteResult,
  InterviewSessionView,
  InterviewSummaryView,
  InterviewTemplatePreset,
} from './interfaces/interview.interfaces';

const SESSION_SELECT = {
  id: true,
  role: true,
  difficulty: true,
  questions: true,
  answers: true,
  feedback: true,
  score: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
} as const satisfies Prisma.InterviewSessionSelect;

type SessionEntity = Prisma.InterviewSessionGetPayload<{ select: typeof SESSION_SELECT }>;

const INTERVIEW_TEMPLATES: InterviewTemplatePreset[] = [
  {
    key: 'frontend-react',
    label: 'Frontend React',
    description: 'Interview practice focused on React, state management, and UI delivery.',
    roles: ['Frontend Developer', 'React Developer', 'UI Engineer'],
    focusAreas: ['React', 'TypeScript', 'State management', 'Accessibility'],
    difficulty: 'MID',
  },
  {
    key: 'backend-api',
    label: 'Backend API',
    description: 'Server-side interview practice for APIs, system design, and data handling.',
    roles: ['Backend Developer', 'API Engineer', 'Full Stack Developer'],
    focusAreas: ['Node.js', 'APIs', 'Databases', 'Scalability'],
    difficulty: 'MID',
  },
  {
    key: 'fullstack-product',
    label: 'Full Stack Product',
    description: 'Balanced practice for full stack product delivery and tradeoff decisions.',
    roles: ['Full Stack Developer', 'Software Engineer'],
    focusAreas: ['Frontend', 'Backend', 'Testing', 'Product thinking'],
    difficulty: 'MID',
  },
  {
    key: 'system-design-senior',
    label: 'Senior System Design',
    description: 'Advanced interview prep for architecture, scale, and platform decisions.',
    roles: ['Senior Software Engineer', 'Staff Engineer'],
    focusAreas: ['Architecture', 'Scale', 'Observability', 'Reliability'],
    difficulty: 'SENIOR',
  },
  {
    key: 'junior-foundations',
    label: 'Junior Foundations',
    description: 'Entry-level questions around fundamentals, problem solving, and communication.',
    roles: ['Junior Developer', 'Intern'],
    focusAreas: ['Fundamentals', 'Debugging', 'Communication', 'Learning mindset'],
    difficulty: 'JUNIOR',
  },
];

@Injectable()
export class InterviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly notificationsService: NotificationsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  getTemplates(): InterviewTemplatePreset[] {
    return INTERVIEW_TEMPLATES;
  }

  async getSummary(): Promise<InterviewSummaryView> {
    const [totalSessions, scoredSessions, scoreStats, byDifficulty, recentSessions] = await Promise.all([
      this.prisma.interviewSession.count(),
      this.prisma.interviewSession.count({ where: { score: { not: null } } }),
      this.prisma.interviewSession.aggregate({
        _avg: { score: true },
      }),
      this.prisma.interviewSession.groupBy({
        by: ['difficulty'],
        _count: { difficulty: true },
      }),
      this.prisma.interviewSession.findMany({
        orderBy: [{ createdAt: 'desc' }],
        take: 8,
        select: {
          id: true,
          role: true,
          difficulty: true,
          score: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalSessions,
      scoredSessions,
      averageScore: scoreStats._avg.score,
      byDifficulty: byDifficulty.map((item) => ({
        difficulty: item.difficulty,
        count: item._count.difficulty,
      })),
      recentSessions,
      templates: INTERVIEW_TEMPLATES,
    };
  }

  async createSession(user: PublicUser, dto: CreateInterviewSessionDto): Promise<InterviewSessionView> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        headline: true,
        bio: true,
        about: true,
        location: true,
        github: true,
        linkedin: true,
      },
    });

    const template = this.resolveTemplate(dto.role, dto.difficulty, dto.templateKey);
    const effectiveFocusAreas = dto.focusAreas?.length ? dto.focusAreas : template.focusAreas;

    const generated = await this.aiService.simulateInterview(
      {
        role: dto.role,
        difficulty: dto.difficulty,
      },
      {
        userId: user.id,
        role: dto.role,
        difficulty: dto.difficulty,
        profile: profile ? (profile as Record<string, unknown>) : null,
      },
    );

    const session = await this.prisma.interviewSession.create({
      data: {
        userId: user.id,
        role: dto.role,
        difficulty: dto.difficulty as InterviewDifficulty,
        questions: this.toJson(this.applyFocusAreas(generated.result, effectiveFocusAreas)),
      },
      select: SESSION_SELECT,
    });

    await Promise.all([
      this.notificationsService.sendUserNotification(user.id, {
        type: NotificationType.AI_REPORT,
        title: 'Interview session ready',
        body: `Your ${dto.difficulty.toLowerCase()} interview session for ${dto.role} is ready.`,
        metadata: this.toJson({ sessionId: session.id, templateKey: template.key }),
      }),
      this.analyticsService.trackEvent(
        {
          name: 'interview.session.created',
          path: '/interviews/me/sessions',
          metadata: this.toJson({
            sessionId: session.id,
            role: dto.role,
            difficulty: dto.difficulty,
            templateKey: template.key,
          }),
        },
        { userId: user.id },
      ),
    ]);

    return this.toView(session);
  }

  async listMySessions(userId: string): Promise<InterviewSessionView[]> {
    const sessions = await this.prisma.interviewSession.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
      select: SESSION_SELECT,
    });

    return sessions.map((session) => this.toView(session));
  }

  async listAllSessions(): Promise<InterviewSessionView[]> {
    const sessions = await this.prisma.interviewSession.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: SESSION_SELECT,
    });

    return sessions.map((session) => this.toView(session));
  }

  async getMySession(userId: string, id: string): Promise<InterviewSessionView> {
    const session = await this.findSessionOrThrow(id);
    this.assertOwnership(session, userId);
    return this.toView(session);
  }

  async submitAnswers(userId: string, id: string, dto: SubmitInterviewAnswersDto): Promise<InterviewSessionView> {
    const session = await this.findSessionOrThrow(id);
    this.assertOwnership(session, userId);

    if (!Array.isArray(dto.answers) || dto.answers.length === 0) {
      throw new BadRequestException('At least one answer is required');
    }

    const updated = await this.prisma.interviewSession.update({
      where: { id },
      data: {
        answers: this.toJson(dto.answers),
      },
      select: SESSION_SELECT,
    });

    await this.analyticsService.trackEvent(
      {
        name: 'interview.answers.submitted',
        path: `/interviews/me/${id}/answers`,
        metadata: this.toJson({ sessionId: id, answersCount: dto.answers.length }),
      },
      { userId },
    );

    return this.toView(updated);
  }

  async generateFeedback(userId: string, id: string, dto?: GenerateInterviewFeedbackDto): Promise<InterviewSessionView> {
    const session = await this.findSessionOrThrow(id);
    this.assertOwnership(session, userId);

    const answers = Array.isArray(session.answers) ? (session.answers as Array<{ questionIndex: number; answer: string }>) : [];
    const questions = Array.isArray(session.questions)
      ? (session.questions as Array<{ question: string; idealAnswerPoints: string[] }>)
      : [];

    const feedback = await this.aiService.simulateInterview(
      {
        role: session.role,
        difficulty: session.difficulty,
      },
      {
        userId,
        role: session.role,
        difficulty: session.difficulty,
      },
    );

    const evaluated = this.buildFeedbackFromAi(feedback.result, answers, questions, dto?.note);

    const updated = await this.prisma.interviewSession.update({
      where: { id },
      data: {
        feedback: this.toJson(evaluated),
        score: evaluated.score ?? null,
      },
      select: SESSION_SELECT,
    });

    await Promise.all([
      this.notificationsService.sendUserNotification(userId, {
        type: NotificationType.AI_REPORT,
        title: 'Interview feedback ready',
        body: `Feedback for your ${session.role} interview is ready.`,
        metadata: this.toJson({ sessionId: id, score: evaluated.score }),
      }),
      this.analyticsService.trackEvent(
        {
          name: 'interview.feedback.generated',
          path: `/interviews/me/${id}/feedback`,
          metadata: this.toJson({ sessionId: id, score: evaluated.score }),
        },
        { userId },
      ),
    ]);

    return this.toView(updated);
  }

  async deleteSession(userId: string, id: string): Promise<InterviewSessionDeleteResult> {
    const session = await this.findSessionOrThrow(id);
    this.assertOwnership(session, userId);
    await this.prisma.interviewSession.delete({ where: { id } });
    return { deleted: true };
  }

  async getSessionForAdmin(id: string): Promise<InterviewSessionView> {
    const session = await this.findSessionOrThrow(id);
    return this.toView(session);
  }

  private resolveTemplate(role: string, difficulty: string, templateKey?: string) {
    const requested = templateKey ? INTERVIEW_TEMPLATES.find((template) => template.key === templateKey) : undefined;
    if (requested) {
      return requested;
    }

    const normalizedRole = role.trim().toLowerCase();
    const normalizedDifficulty = difficulty.trim().toUpperCase();
    return (
      INTERVIEW_TEMPLATES.find((template) =>
        template.roles.some((candidate) => normalizedRole.includes(candidate.toLowerCase())) ||
        template.difficulty === normalizedDifficulty,
      ) || INTERVIEW_TEMPLATES[2]
    );
  }

  private applyFocusAreas(
    result: InterviewSimulationAiResult,
    focusAreas: string[],
  ): InterviewSimulationAiResult {
    if (focusAreas.length === 0) {
      return result;
    }

    const focusQuestions = focusAreas.slice(0, 3).map((focusArea) => ({
      question: `How do you approach ${focusArea.toLowerCase()} in a real project?`,
      idealAnswerPoints: [
        'Explain the approach clearly',
        'Show tradeoffs',
        'Mention measurable impact',
      ],
    }));

    return {
      ...result,
      questions: [...focusQuestions, ...result.questions].slice(0, 6),
    };
  }

  private async findSessionOrThrow(id: string): Promise<SessionEntity> {
    const session = await this.prisma.interviewSession.findUnique({
      where: { id },
      select: SESSION_SELECT,
    });

    if (!session) {
      throw new NotFoundException('Interview session not found');
    }

    return session;
  }

  private assertOwnership(session: SessionEntity, userId: string) {
    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this interview session');
    }
  }

  private buildFeedbackFromAi(
    aiResult: InterviewSimulationAiResult,
    answers: Array<{ questionIndex: number; answer: string }>,
    questions: Array<{ question: string; idealAnswerPoints: string[] }>,
    note?: string,
  ) {
    const answeredCount = answers.filter((item) => typeof item.answer === 'string' && item.answer.trim().length > 0).length;
    const completeness = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
    const baseScore = aiResult.score ?? 72;
    const score = Math.max(0, Math.min(100, Math.round((baseScore + completeness) / 2)));

    return {
      summary: note ? `${aiResult.summary} ${note}` : aiResult.summary,
      strengths: [
        'Structured communication',
        'Relevant experience framing',
        'Clear technical reasoning',
      ],
      gaps: answeredCount < questions.length ? ['Incomplete coverage of all questions'] : ['Add more metrics and impact'],
      recommendations: [
        'Practice with timed answers.',
        'Use more concrete examples and measurable outcomes.',
        'Mirror the role requirements more closely in each answer.',
      ],
      score,
      source: aiResult.source,
    };
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private toView(session: SessionEntity): InterviewSessionView {
    return {
      id: session.id,
      role: session.role,
      difficulty: session.difficulty,
      questions: (session.questions as InterviewSessionView['questions']) ?? [],
      answers: Array.isArray(session.answers)
        ? (session.answers as InterviewSessionView['answers'])
        : null,
      feedback: session.feedback
        ? (session.feedback as InterviewSessionView['feedback'])
        : null,
      score: session.score,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      userId: session.userId,
    };
  }
}
