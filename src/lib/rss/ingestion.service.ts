import type { Source } from '@prisma/client';
import { rssClient } from './rss-client';
import { saveRawArticle } from './raw-article.service';
import { markSourceFetched } from './source-metadata.service';
import type { ParsedRssItem } from './types';
import { createPipelineEvent } from '@/lib/pipeline/event.service';
import { log } from '@/lib/logging/logger';

async function parseFeedWithRetry(url: string) {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await rssClient.parseURL(url);
    } catch (error) {
      lastError = error;
      log({
        level: attempt === 3 ? 'ERROR' : 'WARN',
        message: 'RSS fetch attempt failed',
        context: {
          url,
          attempt,
          error: error instanceof Error ? error.message : 'Unknown RSS error',
        },
      });
      await new Promise((resolve) => setTimeout(resolve, attempt * 400));
    }
  }

  throw lastError;
}

function normalizeParsedItem(item: {
  title?: string;
  contentSnippet?: string;
  content?: string;
  link?: string;
  enclosure?: { url?: string };
  pubDate?: string;
}): ParsedRssItem | null {
  if (!item.link || !item.title) {
    return null;
  }

  return {
    title: item.title.trim(),
    summary: item.contentSnippet?.trim() ?? null,
    content: item.content?.trim() ?? item.contentSnippet?.trim() ?? null,
    canonicalUrl: item.link.trim(),
    imageUrl: item.enclosure?.url?.trim() ?? null,
    publishedAt: item.pubDate ?? null,
  };
}

export async function ingestSource(source: Source, pipelineRunId?: string) {
  const parsedFeed = await parseFeedWithRetry(source.url);

  let createdCount = 0;
  let skippedCount = 0;

  for (const item of parsedFeed.items) {
    const normalized = normalizeParsedItem(item);

    if (!normalized) {
      skippedCount += 1;
      continue;
    }

    const result = await saveRawArticle(source.id, normalized);
    if (result.created) {
      createdCount += 1;
    } else {
      skippedCount += 1;
    }
  }

  await markSourceFetched(source.id);

  if (pipelineRunId) {
    await createPipelineEvent({
      pipelineRunId,
      stage: 'INGEST',
      level: 'INFO',
      message: `Ingested RSS source: ${source.name}`,
      meta: {
        sourceId: source.id,
        createdCount,
        skippedCount,
      },
    });
  }

  return {
    sourceId: source.id,
    sourceName: source.name,
    createdCount,
    skippedCount,
  };
}
