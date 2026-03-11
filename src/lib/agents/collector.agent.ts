import type { RawArticle, Source } from '@prisma/client';
import type { CollectorOutput } from './types';
import { z } from 'zod';
import { runAgentWithValidation } from './runtime';

function extractKeywords(...parts: Array<string | null | undefined>) {
  return parts
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 4)
    .slice(0, 12);
}

export async function runCollectorAgent(article: RawArticle, source: Source): Promise<CollectorOutput> {
  if (!article.title?.trim() || !article.canonicalUrl?.trim()) {
    return {
      status: 'skip',
      skipReason: 'Missing required title or canonical URL',
    };
  }

  const schema = z.object({
    status: z.literal('ok'),
    normalizedArticle: z.object({
      title: z.string().min(1),
      summary: z.string(),
      content: z.string(),
      canonicalUrl: z.string().url(),
      sourceName: z.string().min(1),
      sourceUrl: z.string().url(),
      publishedAt: z.string().nullable(),
      keywords: z.array(z.string()).max(12),
    }),
  });

  return runAgentWithValidation({
    agentName: 'collector',
    payload: { article, source },
    schema,
    fallback: () => ({
      status: 'ok',
      normalizedArticle: {
        title: article.title.trim(),
        summary: article.summary?.trim() || '',
        content: article.content?.trim() || article.summary?.trim() || '',
        canonicalUrl: article.canonicalUrl,
        sourceName: source.name,
        sourceUrl: source.url,
        publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
        keywords: extractKeywords(article.title, article.summary, article.content),
      },
    }),
  });
}
