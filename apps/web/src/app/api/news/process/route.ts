import { NextResponse } from 'next/server';
import { NewsPipeline } from '@/lib/news/services/news-pipeline.service';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { verifyCronSecret } from '@/lib/security/cron-auth';
import { isAuthenticated, isTrustedOrigin } from '@/lib/admin/auth';

/**
 * News Processing API
 *
 * Processes raw articles through AI pipeline.
 *
 * @route GET /api/news/process - Get processing status
 * @route POST /api/news/process - Trigger processing
 */

async function getRateLimitErrorResponse(request: Request): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  const rateLimitResult = await checkRateLimit(`news-process:${clientIP}`, RATE_LIMITS.STRICT);

  if (rateLimitResult.success) {
    return null;
  }

  return NextResponse.json(
    { error: 'Too many requests' },
    {
      status: 429,
      headers: getRateLimitHeaders(rateLimitResult),
    }
  );
}

async function isAuthorizedTrigger(request: Request): Promise<boolean> {
  if (verifyCronSecret(request)) {
    return true;
  }

  const isAdmin = await isAuthenticated();
  return isAdmin && isTrustedOrigin(request);
}

async function requireAuthorizedTrigger(request: Request): Promise<NextResponse | null> {
  const rateLimitError = await getRateLimitErrorResponse(request);
  if (rateLimitError) {
    return rateLimitError;
  }

  const authorized = await isAuthorizedTrigger(request);
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}

export async function GET(request: Request) {
  const authError = await requireAuthorizedTrigger(request);
  if (authError) return authError;

  const [unprocessed, processed] = await Promise.all([
    prisma.rawArticle.count({ where: { isProcessed: false } }),
    prisma.rawArticle.count({ where: { isProcessed: true } }),
  ]);

  return NextResponse.json({
    success: true,
    status: {
      unprocessed,
      processed,
      pending: unprocessed,
    },
    message: 'Use POST to trigger processing',
  });
}

export async function POST(request: Request) {
  const authError = await requireAuthorizedTrigger(request);
  if (authError) return authError;

  const startTime = Date.now();

  try {
    console.log('[news:process] Manual processing triggered');

    // Get count before
    const beforeCount = await prisma.article.count();

    await NewsPipeline.run();

    // Get count after
    const afterCount = await prisma.article.count();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: 'Pipeline completed',
      duration: `${duration}ms`,
      articlesCreated: afterCount - beforeCount,
      totalArticles: afterCount,
    });
  } catch (error) {
    console.error('[news:process] Pipeline failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Pipeline failed',
      },
      { status: 500 }
    );
  }
}
