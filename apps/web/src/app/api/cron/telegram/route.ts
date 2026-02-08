import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { notifyTelegramPost, notifyError } from '@/lib/news/services/admin-notification.service';
import { verifyCronSecret } from '@/lib/security/cron-auth';
import { withRetry } from '@/lib/retry';
import {
  findArticleForTelegramPosting,
  publishArticleById,
  type TelegramPublishResult,
} from '@/lib/news/services/telegram-publisher.service';

/**
 * Telegram Post Cron Endpoint
 *
 * Selects the most important article in time window and posts it to Telegram.
 *
 * @route GET /api/cron/telegram
 */
async function postToTelegram(): Promise<TelegramPublishResult> {
  console.log('[cron:telegram] Telegram post cron started');
  console.log(`[cron:telegram] Time: ${new Date().toISOString()}`);

  // PROD: 1 hour, DEV: 1 minute
  const filterMinutes = process.env.NODE_ENV === 'production' ? 60 : 1;
  const candidate = await findArticleForTelegramPosting(filterMinutes);

  if (!candidate) {
    console.log('[cron:telegram] No new articles to post');
    return { posted: false, reason: 'No articles in selected window' };
  }

  console.log(`[cron:telegram] Selected: "${candidate.title}" (${candidate.importance})`);
  return publishArticleById(candidate.id);
}

/**
 * GET handler - cron trigger
 */
export async function GET(request: Request) {
  const clientIP = getClientIP(request);
  const rateLimitResult = await checkRateLimit(`telegram:${clientIP}`, RATE_LIMITS.STRICT);

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
    const startTime = Date.now();
    const result = await withRetry(() => postToTelegram(), {
      attempts: process.env.NODE_ENV === 'production' ? 2 : 1,
      initialDelayMs: 1000,
      maxDelayMs: 5000,
    });
    const duration = Date.now() - startTime;

    await notifyTelegramPost(result);

    return NextResponse.json({
      success: true,
      message: result.posted ? `Posted: ${result.articleTitle}` : `Skipped: ${result.reason}`,
      duration: `${duration}ms`,
      ...result,
    });
  } catch (error) {
    console.error('[cron:telegram] Telegram cron failed:', error);

    await notifyError('Telegram Post', error instanceof Error ? error.message : 'Unknown error');

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
 * POST handler - manual trigger
 */
export async function POST(request: Request) {
  return GET(request);
}
