import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_URL: z.string().url(),
  INTERNAL_PIPELINE_SECRET: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHANNEL_ID: z.string().min(1),
  CRON_SECRET: z.string().min(1),
  AGENT_RUNTIME_MODE: z.string().min(1),
  WORKER_INTERVAL_MINUTES: z.coerce.number().int().positive().default(30),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    INTERNAL_PIPELINE_SECRET: process.env.INTERNAL_PIPELINE_SECRET,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
    CRON_SECRET: process.env.CRON_SECRET,
    AGENT_RUNTIME_MODE: process.env.AGENT_RUNTIME_MODE,
    WORKER_INTERVAL_MINUTES: process.env.WORKER_INTERVAL_MINUTES ?? '30',
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
