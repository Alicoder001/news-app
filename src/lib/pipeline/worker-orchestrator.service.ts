import { DeliveryStatus, PipelineRunStatus, VerificationStatus } from '@prisma/client';
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

export async function runPipelineCycle() {
  const run = await createPipelineRun();
  await acquirePipelineLock(run.id);

  let found = 0;
  let verified = 0;
  let processed = 0;
  let publishedWeb = 0;
  let publishedTelegram = 0;

  try {
    const sources = await listSources();
    const activeSources = sources.filter((source) => source.isActive);

    await createPipelineEvent({
      pipelineRunId: run.id,
      stage: 'INGEST',
      level: 'INFO',
      message: 'Pipeline cycle started',
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

      const telegramResult = await publishTelegramPost({
        articleId: draft.id,
        text: `${writer.article.shortPost}\n\n${websiteUrl}`,
      });

      if (telegramResult.success) {
        await markTelegramPublished(draft.id, telegramResult.messageId ?? 'pending');
        publishedTelegram += 1;
      } else {
        await createPipelineEvent({
          pipelineRunId: run.id,
          stage: 'PUBLISH_TELEGRAM',
          level: 'WARN',
          message: `Telegram publish failed for article ${draft.id}`,
          meta: { error: telegramResult.error },
        });
      }
    }

    await finalizeRun(run.id, {
      status: PipelineRunStatus.COMPLETED,
      found,
      verified,
      processed,
      publishedWeb,
      publishedTelegram,
    });

    return {
      runId: run.id,
      found,
      verified,
      processed,
      publishedWeb,
      publishedTelegram,
    };
  } catch (error) {
    await finalizeRun(run.id, {
      status: PipelineRunStatus.FAILED,
      found,
      verified,
      processed,
      publishedWeb,
      publishedTelegram,
      notes: error instanceof Error ? error.message : 'Unknown pipeline error',
      errorsCount: 1,
    });

    throw error;
  } finally {
    await releasePipelineLock(run.id);
  }
}
