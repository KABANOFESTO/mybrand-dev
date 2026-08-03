import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, AiReportType } from '@prisma/client';
import { PrismaService } from '@database/prisma/prisma.service';
import { GenerateResumeAiDto } from './dto/generate-resume-ai.dto';
import { GenerateSkillAnalysisDto } from './dto/generate-skill-analysis.dto';
import { GenerateInterviewDto } from './dto/generate-interview.dto';
import { GenerateCodeReviewDto } from './dto/generate-code-review.dto';
import type { AiReportView, CodeReviewAiResult, InterviewSimulationAiResult, ResumeAiResult, SkillAnalysisAiResult } from './interfaces/ai.interfaces';

const AI_REPORT_SELECT = {
  id: true,
  type: true,
  title: true,
  input: true,
  output: true,
  score: true,
  isPremium: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
} as const satisfies Prisma.AiReportSelect;

type AiReportEntity = Prisma.AiReportGetPayload<{ select: typeof AI_REPORT_SELECT }>;

interface ResumeGenerationContext {
  userId?: string;
  targetRole?: string;
  tone?: string;
  focusKeywords?: string[];
  profile?: Record<string, unknown> | null;
  skills?: Array<Record<string, unknown>>;
  experiences?: Array<Record<string, unknown>>;
  education?: Array<Record<string, unknown>>;
  certificates?: Array<Record<string, unknown>>;
  projects?: Array<Record<string, unknown>>;
}

interface SkillAnalysisContext {
  userId?: string;
  targetRole?: string;
  currentRole?: string;
  focusSkills?: string[];
  skills?: Array<Record<string, unknown>>;
}

interface InterviewContext {
  userId?: string;
  role?: string;
  difficulty?: 'JUNIOR' | 'MID' | 'SENIOR';
  profile?: Record<string, unknown> | null;
}

interface CodeReviewContext {
  userId?: string;
  context?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async listMyReports(userId: string): Promise<AiReportView[]> {
    const reports = await this.prisma.aiReport.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
      select: AI_REPORT_SELECT,
    });

    return reports.map((report) => this.toView(report));
  }

  async listAllReports(): Promise<AiReportView[]> {
    const reports = await this.prisma.aiReport.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: AI_REPORT_SELECT,
    });

    return reports.map((report) => this.toView(report));
  }

  async getReportById(id: string): Promise<AiReportView | null> {
    const report = await this.prisma.aiReport.findUnique({
      where: { id },
      select: AI_REPORT_SELECT,
    });

    return report ? this.toView(report) : null;
  }

  async generateResumeDraft(
    dto: GenerateResumeAiDto,
    context: ResumeGenerationContext,
  ): Promise<{ report: AiReportView; result: ResumeAiResult }> {
    const targetRole = dto.targetRole || context.targetRole || 'Software Developer';
    const tone = dto.tone || context.tone || 'professional';
    const focusKeywords = dto.focusKeywords?.length ? dto.focusKeywords : context.focusKeywords || [];

    const prompt = [
      `Create a concise resume summary package for a ${tone} portfolio.`,
      `Target role: ${targetRole}.`,
      focusKeywords.length > 0 ? `Focus keywords: ${focusKeywords.join(', ')}.` : '',
      'Return strict JSON with keys: headline, summary, strengths, keywords, experienceHighlights, projectHighlights, recommendedImprovements, score.',
      `Profile context: ${JSON.stringify(context.profile ?? {})}`,
      `Skills: ${JSON.stringify(context.skills ?? [])}`,
      `Experiences: ${JSON.stringify(context.experiences ?? [])}`,
      `Education: ${JSON.stringify(context.education ?? [])}`,
      `Certificates: ${JSON.stringify(context.certificates ?? [])}`,
      `Projects: ${JSON.stringify(context.projects ?? [])}`,
    ]
      .filter(Boolean)
      .join('\n');

    const fallback = this.buildResumeFallback(targetRole, focusKeywords, context);
    return this.generateStructuredJson<ResumeAiResult>({
      type: AiReportType.RESUME_GENERATION,
      title: `Resume draft for ${targetRole}`,
      prompt,
      fallback,
      input: this.toJsonInput({
        targetRole,
        tone,
        focusKeywords,
        context,
      }),
      userId: context.userId,
    });
  }

  async analyzeSkills(
    dto: GenerateSkillAnalysisDto,
    context: SkillAnalysisContext,
  ): Promise<{ report: AiReportView; result: SkillAnalysisAiResult }> {
    const targetRole = dto.targetRole || context.targetRole || 'Software Developer';
    const currentRole = dto.currentRole || context.currentRole || 'Portfolio Builder';
    const prompt = [
      `Analyze the developer profile for the target role "${targetRole}" and current role "${currentRole}".`,
      'Return strict JSON with keys: summary, strengths, gaps, recommendations, score.',
      `Focus skills: ${JSON.stringify(dto.focusSkills ?? context.focusSkills ?? [])}`,
      `Skills context: ${JSON.stringify(context.skills ?? [])}`,
    ].join('\n');

    const fallback = this.buildSkillFallback(targetRole, currentRole, context);
    return this.generateStructuredJson<SkillAnalysisAiResult>({
      type: AiReportType.SKILL_ANALYSIS,
      title: `Skill analysis for ${targetRole}`,
      prompt,
      fallback,
      input: this.toJsonInput({
        targetRole,
        currentRole,
        focusSkills: dto.focusSkills ?? context.focusSkills ?? [],
        context,
      }),
      userId: context.userId,
    });
  }

  async simulateInterview(
    dto: GenerateInterviewDto,
    context: InterviewContext,
  ): Promise<{ report: AiReportView; result: InterviewSimulationAiResult }> {
    const role = dto.role || context.role || 'Software Developer';
    const difficulty = dto.difficulty || context.difficulty || 'MID';
    const prompt = [
      `Create an interview simulation for a ${difficulty.toLowerCase()} level ${role} role.`,
      'Return strict JSON with keys: summary, questions, score.',
      'Each question must include question and idealAnswerPoints array.',
      `Profile context: ${JSON.stringify(context.profile ?? {})}`,
    ].join('\n');

    const fallback = this.buildInterviewFallback(role, difficulty, context);
    return this.generateStructuredJson<InterviewSimulationAiResult>({
      type: AiReportType.INTERVIEW_SIMULATION,
      title: `Interview simulation for ${role}`,
      prompt,
      fallback,
      input: this.toJsonInput({
        role,
        difficulty,
        context,
      }),
      userId: context.userId,
    });
  }

  async reviewCode(
    dto: GenerateCodeReviewDto,
    context: CodeReviewContext,
  ): Promise<{ report: AiReportView; result: CodeReviewAiResult }> {
    const language = dto.language || 'unknown';
    const prompt = [
      `Review the following ${language} code in a production-minded way.`,
      'Return strict JSON with keys: summary, issues, bestPractices, score.',
      'Each issue must include severity, message, suggestion.',
      dto.context ? `Context: ${dto.context}` : '',
      `Code:\n${dto.code}`,
    ]
      .filter(Boolean)
      .join('\n');

    const fallback = this.buildCodeReviewFallback(language, dto.code);
    return this.generateStructuredJson<CodeReviewAiResult>({
      type: AiReportType.CODE_REVIEW,
      title: `Code review for ${language}`,
      prompt,
      fallback,
      input: this.toJsonInput({
        language,
        context: dto.context ?? context.context ?? null,
        code: dto.code,
      }),
      userId: context.userId,
    });
  }

  async createReport(input: {
    type: AiReportType;
    title: string;
    userId?: string;
    score?: number | null;
    input: Prisma.InputJsonValue;
    output: Prisma.InputJsonValue;
    isPremium?: boolean;
  }): Promise<AiReportView> {
    const report = await this.prisma.aiReport.create({
      data: {
        type: input.type,
        title: input.title,
        userId: input.userId ?? null,
        score: input.score ?? null,
        isPremium: input.isPremium ?? false,
        input: input.input,
        output: input.output,
      },
      select: AI_REPORT_SELECT,
    });

    return this.toView(report);
  }

  private async generateStructuredJson<T>(params: {
    type: AiReportType;
    title: string;
    prompt: string;
    fallback: T;
    input: Prisma.InputJsonValue;
    userId?: string;
  }): Promise<{ report: AiReportView; result: T }> {
    const provider = this.configService.get<string>('ai.provider', 'gemini');
    const baseUrl = this.configService.get<string>(
      'ai.baseUrl',
      'https://generativelanguage.googleapis.com/v1beta',
    );
    const model = this.configService.get<string>('ai.model', 'gemini-1.5-flash');
    const apiKey = this.configService.get<string>('ai.apiKey', '');
    const temperature = this.configService.get<number>('ai.temperature', 0.3);
    const maxOutputTokens = this.configService.get<number>('ai.maxOutputTokens', 2048);
    const timeoutMs = this.configService.get<number>('ai.timeoutMs', 30000);

    let result = params.fallback;
    let source: 'ai' | 'fallback' = 'fallback';

    try {
      if (!apiKey) {
        throw new Error('Missing AI API key');
      }

      result = await this.callProvider<T>({
        provider,
        baseUrl,
        model,
        apiKey,
        temperature,
        maxOutputTokens,
        timeoutMs,
        prompt: params.prompt,
        fallback: params.fallback,
      });
      source = 'ai';
    } catch (error) {
      this.logger.warn(
        `Falling back to deterministic AI output for ${params.type}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }

    const report = await this.createReport({
      type: params.type,
      title: params.title,
      userId: params.userId,
      input: params.input,
      output: {
        ...(result as Record<string, unknown>),
        source,
      } as Prisma.InputJsonValue,
      score: typeof (result as { score?: number | null }).score === 'number' ? ((result as { score?: number | null }).score ?? null) : null,
    });

    return {
      report,
      result: {
        ...(result as Record<string, unknown>),
        source,
      } as T,
    };
  }

  private async callProvider<T>(params: {
    provider: string;
    baseUrl: string;
    model: string;
    apiKey: string;
    temperature: number;
    maxOutputTokens: number;
    timeoutMs: number;
    prompt: string;
    fallback: T;
  }): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), params.timeoutMs);

    try {
      if (params.provider.toLowerCase() === 'gemini') {
        const response = await fetch(
          `${params.baseUrl.replace(/\/$/, '')}/models/${encodeURIComponent(params.model)}:generateContent?key=${encodeURIComponent(params.apiKey)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: params.prompt }] }],
              generationConfig: {
                temperature: params.temperature,
                maxOutputTokens: params.maxOutputTokens,
                responseMimeType: 'application/json',
              },
            }),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Gemini request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
        return this.parseJsonPayload<T>(text, params.fallback);
      }

      const response = await fetch(params.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.apiKey}`,
        },
        body: JSON.stringify({
          model: params.model,
          messages: [{ role: 'user', content: params.prompt }],
          temperature: params.temperature,
          max_tokens: params.maxOutputTokens,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`AI request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        output_text?: string;
      };
      const text = payload.choices?.[0]?.message?.content ?? payload.output_text ?? '';
      return this.parseJsonPayload<T>(text, params.fallback);
    } finally {
      clearTimeout(timeout);
    }
  }

  private parseJsonPayload<T>(payload: string | undefined, fallback: T): T {
    if (!payload) {
      return fallback;
    }

    const trimmed = payload.trim();
    const stripped = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

    try {
      return JSON.parse(stripped) as T;
    } catch {
      return fallback;
    }
  }

  private toJsonInput(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private buildResumeFallback(targetRole: string, focusKeywords: string[], context: ResumeGenerationContext): ResumeAiResult {
    const headline = `${targetRole} | Portfolio-ready developer`;
    const summary = [context.profile?.['headline'], context.profile?.['bio'], context.profile?.['about']]
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim())
      .slice(0, 2)
      .join(' ');

    const experienceHighlights = (context.experiences ?? [])
      .slice(0, 3)
      .map((experience) => `${String(experience['role'] ?? 'Developer')} at ${String(experience['company'] ?? 'Company')}`);

    const projectHighlights = (context.projects ?? [])
      .slice(0, 3)
      .map((project) => String(project['title'] ?? 'Project'));

    return {
      headline,
      summary: summary || `Experienced developer building production-ready digital products with focus on ${targetRole.toLowerCase()}.`,
      strengths: focusKeywords.length ? focusKeywords.slice(0, 5) : ['Problem solving', 'Product thinking', 'Clean implementation', 'Reliability'],
      keywords: focusKeywords.length ? focusKeywords : [targetRole, 'portfolio', 'frontend', 'backend'],
      experienceHighlights,
      projectHighlights,
      recommendedImprovements: [
        'Tailor the summary to the target role.',
        'Quantify the strongest achievements.',
        'Keep the skills section concise and current.',
      ],
      score: 78,
      source: 'fallback',
    };
  }

  private buildSkillFallback(targetRole: string, currentRole: string, context: SkillAnalysisContext): SkillAnalysisAiResult {
    const skills = (context.skills ?? []).slice(0, 5).map((skill) => String(skill['name'] ?? 'Skill'));
    return {
      summary: `The profile is aligned for ${targetRole} with a current focus on ${currentRole}.`,
      strengths: skills.length > 0 ? skills : ['Problem solving', 'Systems thinking', 'API design'],
      gaps: ['Role-specific depth', 'Metrics-backed achievements', 'Recent project emphasis'],
      recommendations: [
        'Highlight the strongest production wins.',
        'Group skills by impact and relevance.',
        'Add measurable outcomes to project descriptions.',
      ],
      score: 74,
      source: 'fallback',
    };
  }

  private buildInterviewFallback(role: string, difficulty: string, context: InterviewContext): InterviewSimulationAiResult {
    return {
      summary: `Interview practice for a ${difficulty.toLowerCase()} ${role} role.`,
      questions: [
        {
          question: `Walk me through a project that best shows your ability to work as a ${role}.`,
          idealAnswerPoints: ['Scope', 'impact', 'tradeoffs', 'results'],
        },
        {
          question: 'How do you make sure your work is production-ready?',
          idealAnswerPoints: ['Testing', 'reviews', 'observability', 'error handling'],
        },
      ],
      score: context.profile ? 80 : 70,
      source: 'fallback',
    };
  }

  private buildCodeReviewFallback(language: string, code: string): CodeReviewAiResult {
    const hasLongFile = code.length > 2000;
    return {
      summary: `Fallback review for ${language} code.`,
      issues: hasLongFile
        ? [
            {
              severity: 'medium',
              message: 'The snippet is quite large for a single review pass.',
              suggestion: 'Split the code into smaller units with focused responsibilities.',
            },
          ]
        : [
            {
              severity: 'low',
              message: 'Review completed in fallback mode.',
              suggestion: 'Run this review again with AI enabled for a deeper analysis.',
            },
          ],
      bestPractices: ['Keep functions small', 'Validate inputs', 'Log meaningful errors'],
      score: 72,
      source: 'fallback',
    };
  }

  private toView(report: AiReportEntity): AiReportView {
    return {
      id: report.id,
      type: report.type,
      title: report.title,
      input: (report.input as Record<string, unknown> | null) ?? null,
      output: (report.output as Record<string, unknown> | null) ?? null,
      score: report.score,
      isPremium: report.isPremium,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      userId: report.userId,
    };
  }
}
