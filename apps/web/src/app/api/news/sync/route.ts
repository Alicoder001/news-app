import { NextResponse } from 'next/server';
import { newsManager } from '@/lib/news/news-manager';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { verifyCronSecret } from '@/lib/security/cron-auth';
import { isAuthenticated, isTrustedOrigin } from '@/lib/admin/auth';

/**
 * News Sync API
 *
 * Fetches articles from all registered providers.
 *
 * @route GET /api/news/sync - Get sync status
 * @route POST /api/news/sync - Trigger sync
 */

async function getRateLimitErrorResponse(request: Request): Promise<NextResponse | null> {
  const clientIP = getClientIP(request);
  const rateLimitResult = await checkRateLimit(`news-sync:${clientIP}`, RATE_LIMITS.STRICT);

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

  const status = newsManager.getStatus();

  return NextResponse.json({
    success: true,
    providers: status.providers,
    providerCount: status.providerCount,
    message: 'Use POST to trigger sync',
  });
}

export async function POST(request: Request) {
  const authError = await requireAuthorizedTrigger(request);
  if (authError) return authError;

  const startTime = Date.now();

  try {
    console.log('[news:sync] Manual sync triggered');

    const result = await newsManager.syncAll();
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      duration: `${duration}ms`,
      ...result,
    });
  } catch (error) {
    console.error('[news:sync] Sync failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  }
}
