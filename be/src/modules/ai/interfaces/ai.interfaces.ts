import { AiReportType } from '@prisma/client';

export interface AiReportView {
  id: string;
  type: AiReportType;
  title: string;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  score: number | null;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export interface ResumeAiResult {
  headline: string;
  summary: string;
  strengths: string[];
  keywords: string[];
  experienceHighlights: string[];
  projectHighlights: string[];
  recommendedImprovements: string[];
  score: number | null;
  source: 'ai' | 'fallback';
}

export interface SkillAnalysisAiResult {
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  score: number | null;
  source: 'ai' | 'fallback';
}

export interface InterviewSimulationAiResult {
  summary: string;
  questions: Array<{
    question: string;
    idealAnswerPoints: string[];
  }>;
  score: number | null;
  source: 'ai' | 'fallback';
}

export interface CodeReviewAiResult {
  summary: string;
  issues: Array<{
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestion: string;
  }>;
  bestPractices: string[];
  score: number | null;
  source: 'ai' | 'fallback';
}
