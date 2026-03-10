import { z } from 'zod';

/**
 * Environment Configuration Schema
 * 
 * Validates all required environment variables at startup.
 * Fails fast if critical variables are missing.
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // AI Provider - At least one required
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),

  // News Sources
  NEWS_API_KEY: z.string().optional(),
  GNEWS_API_KEY: z.string().optional(),

  // Telegram
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),

  // App Config
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * AI Provider Configuration
 */
export type AIProvider = 'openai' | 'gemini';

/**
 * Determine which AI provider to use based on available keys
 */
function getAIProvider(env: z.infer<typeof envSchema>): AIProvider | null {
  if (env.OPENAI_API_KEY) return 'openai';
  if (env.GEMINI_API_KEY) return 'gemini';
  return null;
}

/**
 * Parse and validate environment variables
 */
function parseEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration');
  }

  const aiProvider = getAIProvider(parsed.data);

  return {
    ...parsed.data,
    aiProvider,
    isProduction: parsed.data.NODE_ENV === 'production',
    isDevelopment: parsed.data.NODE_ENV === 'development',
  };
}

/**
 * Validated environment configuration
 * 
 * @example
 * import { env } from '@/lib/config/env';
 * 
 * if (env.aiProvider === 'openai') {
 *   // Use OpenAI
 * }
 */
export const env = parseEnv();

/**
 * Type-safe environment access
 */
export type Env = ReturnType<typeof parseEnv>;
