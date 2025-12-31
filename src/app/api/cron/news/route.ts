import { NextResponse } from 'next/server';
import { newsManager } from '@/lib/news/news-manager';
import { NewsPipeline } from '@/lib/news/services/news-pipeline.service';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Cron Job Endpoint
 * 
 * Full pipeline: Fetch → Process → Post
 * 
 * Can be triggered by:
 * - Vercel Cron Jobs
 * - External cron services (Railway, etc.)
 * - Manual API call
 * 
 * @route GET /api/cron/news
 * @route POST /api/cron/news
 */

/**
 * Verify cron secret (for production security)
 * Supports:
 * - Vercel Cron Jobs (x-vercel-cron header)
 * - Manual triggers with Bearer token
 * - Local development without restrictions
 */
function verifyCronSecret(request: Request): boolean {
  // Check for Vercel Cron header (added by Vercel infrastructure)
  const vercelCron = request.headers.get('x-vercel-cron');
  if (vercelCron === '1') {
    return true;
  }
  
  const cronSecret = process.env.CRON_SECRET;
  
  // Allow in development only if explicitly no secret is set
  if (process.env.NODE_ENV === 'development' && !cronSecret) {
    console.warn('⚠️ CRON_SECRET not set - allowing request in development mode');
    return true;
  }
  
  // Require secret in production
  if (!cronSecret) {
    console.error('❌ CRON_SECRET not configured');
    return false;
  }
  
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

/**
 * Run the full news pipeline
 */
async function runFullPipeline(): Promise<{
  sync: { total: number; byProvider: Record<string, { fetched: number; saved: number }> };
  process: { processed: number; errors: string[] };
  duration: number;
}> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  console.log('🚀 Starting full news pipeline...');
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  
  // Step 1: Sync from all providers
  console.log('\n📥 Step 1: Syncing from providers...');
  const syncResult = await newsManager.syncAll();
  
  // Step 2: Process raw articles
  console.log('\n🤖 Step 2: Processing articles with AI...');
  let processed = 0;
  
  try {
    await NewsPipeline.run();
    // Count would come from pipeline, simplified for now
    processed = syncResult.total;
  } catch (error) {
    errors.push(`Pipeline error: ${error}`);
  }
  
  const duration = Date.now() - startTime;
  
  console.log(`\n✅ Pipeline complete in ${duration}ms`);
  console.log(`   Synced: ${syncResult.total} articles`);
  console.log(`   Processed: ${processed} articles`);
  
  return {
    sync: {
      total: syncResult.total,
      byProvider: syncResult.byProvider,
    },
    process: {
      processed,
      errors: [...syncResult.errors, ...errors],
    },
    duration,
  };
}

/**
 * GET handler - for Vercel Cron
 */
export async function GET(request: Request) {
  // Rate limiting check (before auth to prevent timing attacks)
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(`cron:${clientIP}`, RATE_LIMITS.STRICT);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }
  
  // Verify cron secret
  if (!verifyCronSecret(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const result = await runFullPipeline();
    
    return NextResponse.json({
      success: true,
      message: 'Pipeline completed',
      ...result,
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
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
