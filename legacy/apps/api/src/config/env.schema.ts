import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  DATABASE_URL: z.string().min(1).optional(),
  REDIS_URL: z.string().url().optional(),
  CORS_ORIGIN: z.string().optional(),
  ADMIN_SECRET: z.string().min(8).optional(),
  API_INTERNAL_TOKEN: z.string().min(16).optional(),
  JWT_ACCESS_SECRET: z.string().min(16).optional(),
  JWT_REFRESH_SECRET: z.string().min(16).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

export type EnvSchema = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvSchema {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment variables: ${JSON.stringify(flattened)}`);
  }

  return parsed.data;
}
