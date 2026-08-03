import { AiReportView, ResumeAiResult } from '@modules/ai/interfaces/ai.interfaces';

export interface PrivateResumeView {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  profile: {
    headline: string | null;
    bio: string | null;
    about: string | null;
    location: string | null;
    website: string | null;
    github: string | null;
    linkedin: string | null;
    resumeUrl: string | null;
  } | null;
  summary: string;
  ai: {
    used: boolean;
    report: AiReportView | null;
    output: ResumeAiResult | null;
  };
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: number;
    icon: string | null;
    sortOrder: number;
  }>;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    location: string | null;
    description: string;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    technologies: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string | null;
    score: string | null;
    startDate: Date;
    endDate: Date | null;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issuer: string;
    credentialId: string | null;
    issuedAt: Date;
    expiredAt: Date | null;
    verificationUrl: string | null;
    imageUrl: string | null;
    pdfUrl: string | null;
    skills: string[];
  }>;
  projects: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    repositoryUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    featured: boolean;
    status: string;
    technologies: string[];
    features: string[];
    startDate: Date | null;
    endDate: Date | null;
  }>;
  generatedAt: Date;
}

export interface PublicResumeView {
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  profile: {
    headline: string | null;
    bio: string | null;
    about: string | null;
    location: string | null;
    website: string | null;
    github: string | null;
    linkedin: string | null;
  } | null;
  summary: string;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: number;
    icon: string | null;
    sortOrder: number;
  }>;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    location: string | null;
    description: string;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    technologies: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string | null;
    score: string | null;
    startDate: Date;
    endDate: Date | null;
  }>;
  projects: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    repositoryUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    featured: boolean;
    status: string;
    technologies: string[];
    features: string[];
    startDate: Date | null;
    endDate: Date | null;
  }>;
  generatedAt: Date;
}
