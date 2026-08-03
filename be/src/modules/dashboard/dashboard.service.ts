import { Injectable } from '@nestjs/common';
import { ContactStatus, Prisma, InterviewDifficulty } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import type {
  DashboardCountSummary,
  DashboardInterviewSummary,
  DashboardRecentCertificate,
  DashboardRecentContact,
  DashboardRecentInterviewSession,
  DashboardRecentProject,
  DashboardSummary,
} from './interfaces/dashboard.interfaces';

const RECENT_PROJECT_SELECT = {
  id: true,
  slug: true,
  title: true,
  featured: true,
  createdAt: true,
} as const satisfies Prisma.ProjectSelect;

const RECENT_CONTACT_SELECT = {
  id: true,
  name: true,
  email: true,
  subject: true,
  status: true,
  createdAt: true,
} as const satisfies Prisma.ContactMessageSelect;

const RECENT_CERTIFICATE_SELECT = {
  id: true,
  title: true,
  issuer: true,
  issuedAt: true,
} as const satisfies Prisma.CertificateSelect;

const RECENT_INTERVIEW_SELECT = {
  id: true,
  role: true,
  difficulty: true,
  score: true,
  createdAt: true,
} as const satisfies Prisma.InterviewSessionSelect;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<DashboardSummary> {
    const [counts, recentProjects, recentContacts, recentCertificates, interviewSummary] = await Promise.all([
      this.getCounts(),
      this.prisma.project.findMany({
        orderBy: [{ createdAt: 'desc' }],
        take: 5,
        select: RECENT_PROJECT_SELECT,
      }),
      this.prisma.contactMessage.findMany({
        orderBy: [{ createdAt: 'desc' }],
        take: 5,
        select: RECENT_CONTACT_SELECT,
      }),
      this.prisma.certificate.findMany({
        orderBy: [{ issuedAt: 'desc' }, { createdAt: 'desc' }],
        take: 5,
        select: RECENT_CERTIFICATE_SELECT,
      }),
      this.getInterviewSummary(),
    ]);

    return {
      counts,
      recent: {
        projects: recentProjects.map((project) => this.toRecentProject(project)),
        contacts: recentContacts.map((contact) => this.toRecentContact(contact)),
        certificates: recentCertificates.map((certificate) =>
          this.toRecentCertificate(certificate),
        ),
        interviews: interviewSummary.recentSessions.map((session) => this.toRecentInterview(session)),
      },
      interviews: interviewSummary,
      generatedAt: new Date().toISOString(),
    };
  }

  private async getCounts(): Promise<DashboardCountSummary> {
    const [
      users,
      activeUsers,
      profiles,
      projects,
      featuredProjects,
      certificates,
      skills,
      experiences,
      education,
      contacts,
      newContacts,
      inProgressContacts,
      resolvedContacts,
      archivedContacts,
      aiReports,
      payments,
      notifications,
      analyticsEvents,
      interviewSessions,
      refreshTokens,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.profile.count(),
      this.prisma.project.count(),
      this.prisma.project.count({ where: { featured: true } }),
      this.prisma.certificate.count(),
      this.prisma.skill.count(),
      this.prisma.experience.count(),
      this.prisma.education.count(),
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { status: ContactStatus.NEW } }),
      this.prisma.contactMessage.count({ where: { status: ContactStatus.IN_PROGRESS } }),
      this.prisma.contactMessage.count({ where: { status: ContactStatus.RESOLVED } }),
      this.prisma.contactMessage.count({ where: { status: ContactStatus.ARCHIVED } }),
      this.prisma.aiReport.count(),
      this.prisma.payment.count(),
      this.prisma.notification.count(),
      this.prisma.analyticsEvent.count(),
      this.prisma.interviewSession.count(),
      this.prisma.refreshToken.count(),
    ]);

    return {
      users,
      activeUsers,
      profiles,
      projects,
      featuredProjects,
      certificates,
      skills,
      experiences,
      education,
      contacts,
      newContacts,
      inProgressContacts,
      resolvedContacts,
      archivedContacts,
      aiReports,
      payments,
      notifications,
      analyticsEvents,
      interviewSessions,
      refreshTokens,
    };
  }

  private async getInterviewSummary(): Promise<DashboardInterviewSummary> {
    const [totalSessions, scoredSessions, scoreStats, byDifficulty, recentSessions] = await Promise.all([
      this.prisma.interviewSession.count(),
      this.prisma.interviewSession.count({ where: { score: { not: null } } }),
      this.prisma.interviewSession.aggregate({ _avg: { score: true } }),
      this.prisma.interviewSession.groupBy({
        by: ['difficulty'],
        _count: { difficulty: true },
      }),
      this.prisma.interviewSession.findMany({
        orderBy: [{ createdAt: 'desc' }],
        take: 5,
        select: RECENT_INTERVIEW_SELECT,
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
      recentSessions: recentSessions.map((session) => this.toRecentInterview(session)),
    };
  }

  private toRecentProject(project: { id: string; slug: string; title: string; featured: boolean; createdAt: Date }): DashboardRecentProject {
    return project;
  }

  private toRecentContact(contact: { id: string; name: string; email: string; subject: string; status: ContactStatus; createdAt: Date }): DashboardRecentContact {
    return contact;
  }

  private toRecentCertificate(certificate: { id: string; title: string; issuer: string; issuedAt: Date }): DashboardRecentCertificate {
    return certificate;
  }

  private toRecentInterview(session: { id: string; role: string; difficulty: InterviewDifficulty; score: number | null; createdAt: Date }): DashboardRecentInterviewSession {
    return session;
  }
}
