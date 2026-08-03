import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  provider: process.env.AI_PROVIDER || 'gemini',
  apiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '',
  model: process.env.AI_MODEL || 'gemini-1.5-flash',
  baseUrl:
    process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
  temperature: Number(process.env.AI_TEMPERATURE || '0.3'),
  maxOutputTokens: Number(process.env.AI_MAX_OUTPUT_TOKENS || '2048'),
  timeoutMs: Number(process.env.AI_TIMEOUT_MS || '30000'),
}));
