import { NextResponse } from 'next/server';

import { getInternalBridgeHeaders, requestBackend } from '@/lib/api/backend-client';
import {
  checkRateLimit,
  getClientIP,
  getRateLimitHeaders,
  RATE_LIMITS,
} from '@/lib/rate-limit';

function getMinuteKey(): string {
  return new Date().toISOString().slice(0, 16);
}

function verifyCronSecret(request: Request): boolean {
  const vercelCron = request.headers.get('x-vercel-cron');
  if (vercelCron === '1') {
    return true;
  }

  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(`telegram:${clientIP}`, RATE_LIMITS.STRICT);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      },
    );
  }

  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backend = await requestBackend<{
      accepted: boolean;
      queued: boolean;
      mode: 'queue' | 'dry-run';
      job: string;
      jobId?: string;
    }>('/v1/internal/jobs/trigger', {
      method: 'POST',
      headers: getInternalBridgeHeaders(),
      body: JSON.stringify({
        job: 'telegram-post',
        payload: {
          trigger: 'legacy-cron',
          at: new Date().toISOString(),
          idempotencyKey: `telegram-post:${getMinuteKey()}`,
        },
      }),
    });

    if (!backend.ok || !backend.data?.accepted) {
      return NextResponse.json(
        { success: false, error: 'Failed to trigger backend job' },
        { status: backend.status || 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        backend.data.mode === 'queue'
          ? 'Telegram job queued'
          : 'Telegram job accepted (dry-run mode, redis not configured)',
      ...backend.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
