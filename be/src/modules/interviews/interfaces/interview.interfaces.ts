import { InterviewDifficulty } from '@prisma/client';
import type { InterviewSimulationAiResult } from '@modules/ai/interfaces/ai.interfaces';

export interface InterviewTemplatePreset {
  key: string;
  label: string;
  description: string;
  roles: string[];
  focusAreas: string[];
  difficulty: InterviewDifficulty;
}

export interface InterviewSessionView {
  id: string;
  role: string;
  difficulty: InterviewDifficulty;
  questions: InterviewSimulationAiResult['questions'];
  answers: Array<{
    questionIndex: number;
    answer: string;
  }> | null;
  feedback: {
    summary: string;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
    score: number | null;
    source: 'ai' | 'fallback';
  } | null;
  score: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export interface InterviewSummaryView {
  totalSessions: number;
  scoredSessions: number;
  averageScore: number | null;
  byDifficulty: Array<{
    difficulty: InterviewDifficulty;
    count: number;
  }>;
  recentSessions: Array<Pick<InterviewSessionView, 'id' | 'role' | 'difficulty' | 'score' | 'createdAt'>>;
  templates: InterviewTemplatePreset[];
}

export interface InterviewSessionDeleteResult {
  deleted: boolean;
}
