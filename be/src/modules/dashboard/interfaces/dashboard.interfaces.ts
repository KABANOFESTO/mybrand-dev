export interface DashboardCountSummary {
  users: number;
  activeUsers: number;
  profiles: number;
  projects: number;
  featuredProjects: number;
  certificates: number;
  skills: number;
  experiences: number;
  education: number;
  contacts: number;
  newContacts: number;
  inProgressContacts: number;
  resolvedContacts: number;
  archivedContacts: number;
  aiReports: number;
  payments: number;
  notifications: number;
  analyticsEvents: number;
  interviewSessions: number;
  refreshTokens: number;
}

export interface DashboardRecentProject {
  id: string;
  slug: string;
  title: string;
  featured: boolean;
  createdAt: Date;
}

export interface DashboardRecentContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: import('@prisma/client').ContactStatus;
  createdAt: Date;
}

export interface DashboardRecentCertificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: Date;
}

export interface DashboardRecentInterviewSession {
  id: string;
  role: string;
  difficulty: import('@prisma/client').InterviewDifficulty;
  score: number | null;
  createdAt: Date;
}

export interface DashboardInterviewSummary {
  totalSessions: number;
  scoredSessions: number;
  averageScore: number | null;
  byDifficulty: Array<{ difficulty: import('@prisma/client').InterviewDifficulty; count: number }>;
  recentSessions: DashboardRecentInterviewSession[];
}

export interface DashboardSummary {
  counts: DashboardCountSummary;
  recent: {
    projects: DashboardRecentProject[];
    contacts: DashboardRecentContact[];
    certificates: DashboardRecentCertificate[];
    interviews: DashboardRecentInterviewSession[];
  };
  interviews: DashboardInterviewSummary;
  generatedAt: string;
}
