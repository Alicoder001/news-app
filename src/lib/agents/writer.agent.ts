import type { VerificationRecord } from '@prisma/client';
import type { WriterOutput } from './types';
import type { CollectorOutput } from './types';
import { z } from 'zod';
import { runAgentWithValidation } from './runtime';
import { sanitizeHtml } from '@/lib/content/sanitize';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function inferCategory(content: string) {
  const lower = content.toLowerCase();
  if (lower.includes('openai') || lower.includes('llm') || lower.includes('model')) return 'ai';
  if (lower.includes('security') || lower.includes('cyber')) return 'security';
  if (lower.includes('cloud')) return 'cloud';
  return 'tech';
}

export async function runWriterAgent(
  normalized: NonNullable<CollectorOutput['normalizedArticle']>,
  verification: VerificationRecord,
): Promise<WriterOutput> {
  if (verification.status === 'INSUFFICIENT') {
    return {
      status: 'hold',
      decisionReason: 'Verification is insufficient',
    };
  }

  const category = inferCategory(`${normalized.title} ${normalized.summary} ${normalized.content}`);
  const title = normalized.title;
  const shortSummary = normalized.summary || normalized.content.slice(0, 180);
  const fullArticle = sanitizeHtml([
    `<p>${normalized.summary || normalized.title}</p>`,
    `<p>${normalized.content || normalized.summary || normalized.title}</p>`,
    `<p>Manba: ${normalized.sourceName}</p>`,
  ].join('\n'));

  const schema = z.object({
    status: z.literal('ok'),
    article: z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      category: z.string().min(1),
      tags: z.array(z.string()).max(5),
      shortPost: z.string().min(1),
      shortSummary: z.string().min(1),
      fullArticle: z.string().min(1),
      confidence: z.number().min(0).max(1),
      sources: z.array(
        z.object({
          name: z.string().min(1),
          url: z.string().url(),
        }),
      ),
    }),
  });

  return runAgentWithValidation({
    agentName: 'writer',
    payload: { normalized, verification },
    schema,
    fallback: () => ({
      status: 'ok',
      article: {
        title,
        slug: slugify(title),
        category,
        tags: normalized.keywords.slice(0, 5),
        shortPost: `${title}\n\n${shortSummary}`,
        shortSummary,
        fullArticle,
        confidence: verification.confidence,
        sources: [{ name: normalized.sourceName, url: normalized.sourceUrl }],
      },
    }),
  });
}
