import { ArticleStatus, DeliveryStatus, PipelineRunStatus, VerificationStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { listSources } from '@/lib/rss/source.service';
import { ingestSource } from '@/lib/rss/ingestion.service';
import { acquirePipelineLock, createPipelineRun, releasePipelineLock } from './run.service';
import { createPipelineEvent } from './event.service';
import { verifyRawArticle } from '@/lib/verification/verification.service';
import { runCollectorAgent } from '@/lib/agents/collector.agent';
import { runWriterAgent } from '@/lib/agents/writer.agent';
import { runReviewerAgent } from '@/lib/agents/reviewer.agent';
import {
  createDraftArticle,
  markArticleApproved,
  markArticleHeld,
  markArticleRejected,
  markTelegramPublished,
} from '@/lib/publish/article-publish.service';
import { createDeliveryRecord } from '@/lib/publish/delivery.service';
import { publishTelegramPost } from '@/lib/telegram/telegram-publish.service';
import { getEnv } from '@/lib/validation/env';

function buildWebsiteUrl(slug: string) {
  const env = getEnv();
  return `${env.APP_URL.replace(/\/$/, '')}/articles/${slug}`;
}

function getReferenceSources(verification: { matchedSources?: unknown }, primarySource: { name: string; url: string }) {
  const matchedSources = Array.isArray(verification.matchedSources) ? verification.matchedSources : [];
  return matchedSources.length > 0
    ? matchedSources.map((source) => ({
        name: typeof source === 'object' && source && 'sourceName' in source ? String(source.sourceName) : primarySource.name,
        url: typeof source === 'object' && source && 'sourceUrl' in source ? String(source.sourceUrl) : primarySource.url,
      }))
    : [{ name: primarySource.name, url: primarySource.url }];
}

async function finalizeRun(
  runId: string,
  data: {
    status: PipelineRunStatus;
    found: number;
    verified: number;
    processed: number;
    publishedWeb: number;
    publishedTelegram: number;
    notes?: string;
    errorsCount?: number;
  },
) {
  await prisma.pipelineRun.update({
    where: { id: runId },
    data: {
      status: data.status,
      finishedAt: new Date(),
      articlesFound: data.found,
      articlesVerified: data.verified,
      articlesProcessed: data.processed,
      articlesPublishedWeb: data.publishedWeb,
      articlesPublishedTelegram: data.publishedTelegram,
      errorsCount: data.errorsCount ?? 0,
      notes: data.notes,
    },
  });
}

// Mode 1: RSS fetch loop only.
export async function runIngestOnly() {
  const run = await createPipelineRun();
  await acquirePipelineLock(run.id);

  let found = 0;

  try {
    const sources = await listSources();
    const activeSources = sources.filter((source) => source.isActive);

    await createPipelineEvent({
      pipelineRunId: run.id,
      stage: 'INGEST',
      level: 'INFO',
      message: 'Ingest-only run started',
      meta: { activeSources: activeSources.length },
    });

    for (const source of activeSources) {
      try {
        const ingestResult = await ingestSource(source, run.id);
        found += ingestResult.createdCount;
      } catch (error) {
        await createPipelineEvent({
          pipelineRunId: run.id,
          stage: 'INGEST',
          level: 'ERROR',
          message: `Failed to ingest RSS source: ${source.name}`,
          meta: {
            sourceId: source.id,
            sourceUrl: source.url,
            error: error instanceof Error ? error.message : 'Unknown RSS error',
          },
        });
      }
    }

    await finalizeRun(run.id, {
      status: PipelineRunStatus.COMPLETED,
      found,
      verified: 0,
      processed: 0,
      publishedWeb: 0,
      publishedTelegram: 0,
    });

    return { runId: run.id, found };
  } catch (error) {
    await finalizeRun(run.id, {
      status: PipelineRunStatus.FAILED,
      found,
      verified: 0,
      processed: 0,
      publishedWeb: 0,
      publishedTelegram: 0,
      notes: error instanceof Error ? error.message : 'Unknown ingest error',
      errorsCount: 1,
    });

    throw error;
  } finally {
    await releasePipelineLock(run.id);
  }
}

// Mode 2: verify + collector/writer/reviewer + createDraft + markApproved (WEB only, no Telegram).
export async function runProcessBatch() {
  const run = await createPipelineRun();
  await acquirePipelineLock(run.id);

  let verified = 0;
  let processed = 0;
  let publishedWeb = 0;

  try {
    const rawArticles = await prisma.rawArticle.findMany({
      where: { isProcessed: false, isDuplicate: false },
      include: { source: true, verificationRecord: true, article: true },
      orderBy: { ingestedAt: 'asc' },
      take: 20,
    });

    for (const rawArticle of rawArticles) {
      const verification = rawArticle.verificationRecord ?? (await verifyRawArticle(rawArticle.id));
      verified += verification.status === VerificationStatus.INSUFFICIENT ? 0 : 1;

      if (verification.status === VerificationStatus.INSUFFICIENT) {
        const reason = verification.notes ?? 'Verification is insufficient';
        await markArticleHeld(rawArticle.id, reason);
        await createPipelineEvent({
          pipelineRunId: run.id,
          stage: 'VERIFY',
          level: 'WARN',
          message: `Verification placed article on hold: ${rawArticle.id}`,
          meta: { reason, sourceCount: verification.sourceCount },
        });
        continue;
      }

      const collector = await runCollectorAgent(rawArticle, rawArticle.source);
      if (collector.status !== 'ok' || !collector.normalizedArticle) {
        await markArticleHeld(rawArticle.id, collector.skipReason ?? 'Collector skipped article');
        await createPipelineEvent({
          pipelineRunId: run.id,
          stage: 'COLLECT',
          level: 'WARN',
          message: `Collector skipped article ${rawArticle.id}`,
          meta: { skipReason: collector.skipReason ?? 'unknown' },
        });
        continue;
      }

      const writer = await runWriterAgent(collector.normalizedArticle, verification);
      if (writer.status !== 'ok' || !writer.article) {
        await markArticleHeld(rawArticle.id, writer.decisionReason ?? 'Writer skipped article');
        await createPipelineEvent({
          pipelineRunId: run.id,
          stage: 'WRITE',
          level: 'WARN',
          message: `Writer skipped article ${rawArticle.id}`,
          meta: { reason: writer.decisionReason ?? 'unknown' },
        });
        continue;
      }

      const review = await runReviewerAgent(writer.article, verification);
      if (review.decision !== 'APPROVE') {
        if (review.decision === 'REJECT') {
          await markArticleRejected(rawArticle.id, review.reason);
        } else {
          await markArticleHeld(rawArticle.id, review.reason);
        }

        await createPipelineEvent({
          pipelineRunId: run.id,
          stage: 'REVIEW',
          level: 'WARN',
          message: `Reviewer held or rejected article ${rawArticle.id}`,
          meta: { decision: review.decision, reason: review.reason, issues: review.issues },
        });
        continue;
      }

      const draft = await createDraftArticle({
        rawArticleId: rawArticle.id,
        slug: writer.article.slug,
        title: writer.article.title,
        shortSummary: writer.article.shortSummary,
        shortPost: writer.article.shortPost,
        fullArticle: writer.article.fullArticle,
        category: writer.article.category,
        tags: writer.article.tags,
        sourceReferences: getReferenceSources(verification, {
          name: rawArticle.source.name,
          url: rawArticle.source.url,
        }),
      });

      processed += 1;

      const websiteUrl = buildWebsiteUrl(draft.slug);
      await markArticleApproved(draft.id, websiteUrl);
      await createDeliveryRecord({
        articleId: draft.id,
        channel: 'WEB',
        status: DeliveryStatus.SUCCESS,
        externalId: websiteUrl,
      });
      publishedWeb += 1;
    }

    await finalizeRun(run.id, {
      status: PipelineRunStatus.COMPLETED,
      found: 0,
      verified,
      processed,
      publishedWeb,
      publishedTelegram: 0,
    });

    return { runId: run.id, verified, processed, publishedWeb };
  } catch (error) {
    await finalizeRun(run.id, {
      status: PipelineRunStatus.FAILED,
      found: 0,
      verified,
      processed,
      publishedWeb,
      publishedTelegram: 0,
      notes: error instanceof Error ? error.message : 'Unknown process error',
      errorsCount: 1,
    });

    throw error;
  } finally {
    await releasePipelineLock(run.id);
  }
}

// Mode 3: drip-publish APPROVED articles with telegramPublished=false, oldest first.
export async function runPublishDrip(maxPerRun?: number) {
  const env = getEnv();
  const limit = Math.floor(maxPerRun ?? env.PUBLISH_MAX_PER_RUN);
  const run = await createPipelineRun();
  await acquirePipelineLock(run.id);

  let publishedTelegram = 0;

  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const todayCount = await prisma.article.count({
      where: {
        telegramPublished: true,
        telegramPublishedAt: { gte: startOfDay },
      },
    });

    const remaining = env.PUBLISH_DAILY_CAP - todayCount;

    if (remaining <= 0) {
      await finalizeRun(run.id, {
        status: PipelineRunStatus.COMPLETED,
        found: 0,
        verified: 0,
        processed: 0,
        publishedWeb: 0,
        publishedTelegram: 0,
        notes: 'Telegram daily cap reached, skipping publish',
      });

      return { runId: run.id, publishedTelegram: 0, capped: true };
    }

    const take = Math.floor(Math.min(limit, remaining));

    const pending = await prisma.article.findMany({
      where: { status: ArticleStatus.APPROVED, telegramPublished: false },
      orderBy: { createdAt: 'asc' },
      take,
    });

    for (const article of pending) {
      const websiteUrl = article.websiteUrl ?? buildWebsiteUrl(article.slug);
      const sourceRefs = Array.isArray(article.sourceReferences)
        ? (article.sourceReferences as Array<{ name?: unknown; url?: unknown }>)
            .filter((ref) => typeof ref?.url === 'string')
            .map((ref) => ({ name: typeof ref?.name === 'string' ? ref.name : 'Manba', url: ref.url as string }))
        : null;

      const telegramResult = await publishTelegramPost({
        articleId: article.id,
        title: article.title,
        shortSummary: article.shortSummary ?? article.shortPost ?? undefined,
        websiteUrl,
        category: article.category,
        tags: article.tags,
        sourceRefs,
      });

      if (telegramResult.success) {
        await markTelegramPublished(article.id, telegramResult.messageId ?? 'pending');
        publishedTelegram += 1;
      } else {
        await createPipelineEvent({
          pipelineRunId: run.id,
          stage: 'PUBLISH_TELEGRAM',
          level: 'WARN',
          message: `Telegram publish failed for article ${article.id}`,
          meta: { error: telegramResult.error },
        });
      }
    }

    await finalizeRun(run.id, {
      status: PipelineRunStatus.COMPLETED,
      found: 0,
      verified: 0,
      processed: 0,
      publishedWeb: 0,
      publishedTelegram,
    });

    return { runId: run.id, publishedTelegram, capped: false };
  } catch (error) {
    await finalizeRun(run.id, {
      status: PipelineRunStatus.FAILED,
      found: 0,
      verified: 0,
      processed: 0,
      publishedWeb: 0,
      publishedTelegram,
      notes: error instanceof Error ? error.message : 'Unknown publish error',
      errorsCount: 1,
    });

    throw error;
  } finally {
    await releasePipelineLock(run.id);
  }
}

// Compat: full cycle = ingest + process + publish drip.
export async function runPipelineCycle() {
  const ingest = await runIngestOnly();
  const processed = await runProcessBatch();
  const published = await runPublishDrip();

  return {
    runId: processed.runId,
    found: ingest.found,
    verified: processed.verified,
    processed: processed.processed,
    publishedWeb: processed.publishedWeb,
    publishedTelegram: published.publishedTelegram,
  };
}
