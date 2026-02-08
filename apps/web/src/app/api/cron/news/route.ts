import { NextResponse } from 'next/server';
import { newsManager } from '@/lib/news/news-manager';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { notifySyncResult, notifyError } from '@/lib/news/services/admin-notification.service';
import { verifyCronSecret } from '@/lib/security/cron-auth';
import { withRetry } from '@/lib/retry';

/**
 * Cron Job Endpoint
 *
 * Pipeline: Fetch -> Process
 *
 * @route GET /api/cron/news
 * @route POST /api/cron/news
 */

/**
 * Run sync + process pipeline
 * 1. Sync news from providers
 * 2. Process new articles with AI
 * 3. Approved articles become visible on site (Telegram posting handled by /api/cron/telegram)
 */
async function runSyncPipeline(): Promise<{
  sync: { total: number; byProvider: Record<string, { fetched: number; saved: number }> };
  process: { processed: number; skipped: number; errors: number };
  duration: number;
}> {
  const startTime = Date.now();
  const prisma = (await import('@/lib/prisma')).default;

  console.log('[cron:news] Starting news sync + process');
  console.log(`[cron:news] Time: ${new Date().toISOString()}`);

  // Step 1: Sync from all providers
  const syncResult = await newsManager.syncAll();
  console.log(`[cron:news] Sync result: ${syncResult.total} new articles`);

  // Step 2: Process unprocessed articles with AI
  const { NewsPipeline } = await import('@/lib/news/services/news-pipeline.service');
  const processResult = await NewsPipeline.run(10);

  const duration = Date.now() - startTime;

  // Count published articles (visible on site)
  const publishedCount = await prisma.article.count({
    where: {
      createdAt: {
        gte: new Date(startTime),
      },
    },
  });

  console.log(`[cron:news] Complete in ${duration}ms`);
  console.log(`[cron:news] Synced: ${syncResult.total}`);
  console.log(`[cron:news] Processed: ${processResult.processed}`);
  console.log(`[cron:news] Published to site: ${publishedCount}`);

  return {
    sync: {
      total: syncResult.total,
      byProvider: syncResult.byProvider,
    },
    process: processResult,
    duration,
  };
}

/**
 * GET handler - for Vercel Cron
 */
export async function GET(request: Request) {
  // Rate limiting check (before auth to reduce timing side-channels)
  const clientIP = getClientIP(request);
  const rateLimitResult = await checkRateLimit(`cron:${clientIP}`, RATE_LIMITS.STRICT);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await withRetry(
      () => runSyncPipeline(),
      {
        attempts: process.env.NODE_ENV === 'production' ? 3 : 1,
        initialDelayMs: 1000,
        maxDelayMs: 8000,
      }
    );

    // Notify admin about sync result
    await notifySyncResult({
      synced: result.sync.total,
      processed: result.process.processed,
      published: result.process.processed,
      duration: result.duration,
    });

    return NextResponse.json({
      success: true,
      message: 'Pipeline completed',
      ...result,
    });
  } catch (error) {
    console.error('[cron:news] Cron job failed:', error);

    // Notify admin about error
    await notifyError('News Sync', error instanceof Error ? error.message : 'Unknown error');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler - for manual triggers
 */
export async function POST(request: Request) {
  return GET(request);
}
