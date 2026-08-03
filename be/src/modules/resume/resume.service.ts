import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { AiService } from '@modules/ai/ai.service';
import type { AiReportView, ResumeAiResult } from '@modules/ai/interfaces/ai.interfaces';
import { NotificationsService } from '@modules/notifications/notifications.service';
import { AnalyticsService } from '@modules/analytics/analytics.service';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import type { PrivateResumeView, PublicResumeView } from './interfaces/resume.interfaces';

const RESUME_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
} as const satisfies Prisma.UserSelect;

const RESUME_PROFILE_SELECT = {
  headline: true,
  bio: true,
  about: true,
  location: true,
  website: true,
  github: true,
  linkedin: true,
  resumeUrl: true,
} as const satisfies Prisma.ProfileSelect;

const RESUME_SKILL_SELECT = {
  id: true,
  name: true,
  category: true,
  proficiency: true,
  icon: true,
  sortOrder: true,
} as const satisfies Prisma.SkillSelect;

const RESUME_EXPERIENCE_SELECT = {
  id: true,
  company: true,
  role: true,
  location: true,
  description: true,
  startDate: true,
  endDate: true,
  current: true,
  technologies: true,
} as const satisfies Prisma.ExperienceSelect;

const RESUME_EDUCATION_SELECT = {
  id: true,
  institution: true,
  degree: true,
  field: true,
  location: true,
  score: true,
  startDate: true,
  endDate: true,
} as const satisfies Prisma.EducationSelect;

const RESUME_CERTIFICATE_SELECT = {
  id: true,
  title: true,
  issuer: true,
  credentialId: true,
  issuedAt: true,
  expiredAt: true,
  verificationUrl: true,
  imageUrl: true,
  pdfUrl: true,
  skills: true,
} as const satisfies Prisma.CertificateSelect;

const RESUME_PROJECT_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  repositoryUrl: true,
  liveUrl: true,
  imageUrl: true,
  featured: true,
  status: true,
  technologies: true,
  features: true,
  startDate: true,
  endDate: true,
} as const satisfies Prisma.ProjectSelect;

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly notificationsService: NotificationsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async getMyResume(userId: string): Promise<PrivateResumeView> {
    return this.buildPrivateResume(userId);
  }

  async getPublicResume(userId: string): Promise<PublicResumeView> {
    return this.buildPublicResume(userId);
  }

  async generateMyResume(userId: string, dto: GenerateResumeDto): Promise<PrivateResumeView> {
    const resumeData = await this.getResumeData(userId);
    const generated = await this.aiService.generateResumeDraft(dto, {
      userId,
      targetRole: dto.targetRole,
      tone: dto.tone,
      focusKeywords: dto.focusKeywords,
      profile: resumeData.profile,
      skills: resumeData.skills,
      experiences: resumeData.experiences,
      education: resumeData.education,
      certificates: resumeData.certificates,
      projects: resumeData.projects,
    });

    await Promise.all([
      this.notificationsService.sendUserNotification(userId, {
        type: NotificationType.AI_REPORT,
        title: 'Resume draft ready',
        body: 'Your AI-powered resume draft is ready for review.',
        metadata: {
          reportId: generated.report.id,
          targetRole: dto.targetRole ?? null,
        } as Prisma.InputJsonValue,
      }),
      this.analyticsService.trackEvent(
        {
          name: 'resume.generated',
          path: '/resume/me/generate',
          metadata: {
            reportId: generated.report.id,
            targetRole: dto.targetRole ?? null,
          } as Prisma.InputJsonValue,
        },
        { userId },
      ),
    ]);

    return this.buildPrivateResume(userId, generated.report, generated.result);
  }

  private async buildPrivateResume(
    userId: string,
    aiReport: AiReportView | null = null,
    aiOutput: ResumeAiResult | null = null,
  ): Promise<PrivateResumeView> {
    const resumeData = await this.getResumeData(userId);

    return {
      user: resumeData.user,
      profile: resumeData.profile,
      summary: aiOutput?.summary ?? this.getProfileSummary(resumeData),
      ai: {
        used: Boolean(aiReport),
        report: aiReport,
        output: aiOutput,
      },
      skills: resumeData.skills,
      experiences: resumeData.experiences,
      education: resumeData.education,
      certificates: resumeData.certificates,
      projects: resumeData.projects,
      generatedAt: aiReport?.createdAt ?? new Date(),
    };
  }

  private async buildPublicResume(userId: string): Promise<PublicResumeView> {
    const resumeData = await this.getResumeData(userId);

    return {
      user: {
        id: resumeData.user.id,
        name: resumeData.user.name,
        avatarUrl: resumeData.user.avatarUrl,
      },
      profile: resumeData.profile
        ? {
            headline: resumeData.profile.headline,
            bio: resumeData.profile.bio,
            about: resumeData.profile.about,
            location: resumeData.profile.location,
            website: resumeData.profile.website,
            github: resumeData.profile.github,
            linkedin: resumeData.profile.linkedin,
          }
        : null,
      summary: this.getProfileSummary(resumeData),
      skills: resumeData.skills,
      experiences: resumeData.experiences,
      education: resumeData.education,
      projects: resumeData.projects,
      generatedAt: new Date(),
    };
  }

  private async getResumeData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...RESUME_USER_SELECT,
        profile: {
          select: RESUME_PROFILE_SELECT,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Resume user not found');
    }

    const [skills, experiences, education, certificates, projects] = await Promise.all([
      this.prisma.skill.findMany({
        orderBy: [{ sortOrder: 'asc' }, { proficiency: 'desc' }, { name: 'asc' }],
        select: RESUME_SKILL_SELECT,
      }),
      this.prisma.experience.findMany({
        orderBy: [{ startDate: 'desc' }],
        select: RESUME_EXPERIENCE_SELECT,
      }),
      this.prisma.education.findMany({
        orderBy: [{ startDate: 'desc' }],
        select: RESUME_EDUCATION_SELECT,
      }),
      this.prisma.certificate.findMany({
        orderBy: [{ issuedAt: 'desc' }],
        select: RESUME_CERTIFICATE_SELECT,
      }),
      this.prisma.project.findMany({
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: 8,
        select: RESUME_PROJECT_SELECT,
      }),
    ]);

    return {
      user,
      profile: user.profile,
      skills,
      experiences,
      education,
      certificates,
      projects,
    };
  }

  private getProfileSummary(resumeData: Awaited<ReturnType<ResumeService['getResumeData']>>) {
    const values = [resumeData.profile?.headline, resumeData.profile?.bio, resumeData.profile?.about]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.trim());

    return values[0] || `Professional portfolio for ${resumeData.user.name} with a focus on shipping reliable software.`;
  }
}
