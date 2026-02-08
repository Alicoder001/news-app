import { NextResponse } from 'next/server';
import { z } from 'zod';

const sourceTypeSchema = z.enum(['NEWS_API', 'RSS', 'SCRAPER']);
const difficultySchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);
const importanceSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function toOptionalUrl(value: unknown): string | undefined {
  const stringValue = toOptionalString(value);
  if (!stringValue) return undefined;
  return stringValue;
}

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const adminLoginSchema = z.object({
  secret: z.string().trim().min(1, 'Secret talab qilinadi').max(512),
});

export const createSourceSchema = z.object({
  name: z.string().trim().min(1, 'Nom talab qilinadi').max(120),
  type: sourceTypeSchema.default('RSS'),
  url: z.string().trim().url('URL noto\'g\'ri formatda'),
  isActive: z.boolean().optional().default(true),
});

export const updateSourceSchema = z
  .object({
    name: z.preprocess((value) => toOptionalString(value), z.string().min(1).max(120).optional()),
    type: sourceTypeSchema.optional(),
    url: z.preprocess(
      (value) => toOptionalUrl(value),
      z.string().url('URL noto\'g\'ri formatda').optional()
    ),
    isActive: z.boolean().optional(),
  })
  .refine((payload) => Object.values(payload).some((value) => value !== undefined), {
    message: 'Kamida bitta maydon yuborilishi kerak',
  });

export const updateArticleSchema = z.object({
  title: z.string().trim().min(3, 'Sarlavha juda qisqa').max(300),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug juda qisqa')
    .max(200, 'Slug juda uzun')
    .regex(slugRegex, 'Slug faqat kichik harf, raqam va "-" dan iborat bo\'lishi kerak'),
  summary: z.preprocess((value) => toOptionalString(value), z.string().max(2000).optional()),
  content: z.string().trim().min(10, 'Kontent juda qisqa'),
  imageUrl: z.preprocess((value) => toOptionalUrl(value), z.string().url('Rasm URL noto\'g\'ri').optional()),
  categoryId: z.preprocess((value) => toOptionalString(value), z.string().optional()),
  difficulty: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim().toUpperCase() : value),
    difficultySchema.optional()
  ),
  importance: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim().toUpperCase() : value),
    importanceSchema.optional()
  ),
  readingTime: z.coerce.number().int().min(1).max(240).optional(),
});

type ValidationErrorDetails = Record<string, string[] | undefined>;

function buildValidationError(details: ValidationErrorDetails): NextResponse {
  return NextResponse.json(
    {
      error: 'Validatsiya xatosi',
      message: 'Validatsiya xatosi',
      details,
    },
    { status: 400 }
  );
}

export async function parseJsonBody<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      data: null,
      error: NextResponse.json(
        { error: 'JSON formati noto\'g\'ri', message: 'JSON formati noto\'g\'ri' },
        { status: 400 }
      ),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return {
      data: null,
      error: buildValidationError({
        ...flattened.fieldErrors,
        _form: flattened.formErrors.length ? flattened.formErrors : undefined,
      }),
    };
  }

  return { data: parsed.data, error: null };
}
