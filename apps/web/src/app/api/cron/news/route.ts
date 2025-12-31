import { NextResponse } from 'next/server';
import { newsManager } from '@/lib/news/news-manager';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import { notifySyncResult, notifyError } from '@/lib/news/services/admin-notification.service';

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
  
  // Development rejimda har doim ruxsat
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  const cronSecret = process.env.CRON_SECRET;
  
  // Require secret in production
  if (!cronSecret) {
    console.error('❌ CRON_SECRET not configured');
    return false;
  }
  
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

/**
 * Run sync + process pipeline
 * 1. Sync news from providers
 * 2. Process new articles with AI
 * 3. Approved articles become visible on site
 */
async function runSyncPipeline(): Promise<{
  sync: { total: number; byProvider: Record<string, { fetched: number; saved: number }> };
  process: { processed: number; skipped: number; errors: number };
  duration: number;
}> {
  const startTime = Date.now();
  const prisma = (await import('@/lib/prisma')).default;
  
  console.log('📥 Starting news sync + process...');
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  
  // DEBUG: Check env variables
  console.log('🔑 ENV Debug:');
  console.log(`   THENEWSAPI_KEY: ${process.env.THENEWSAPI_KEY ? 'SET (' + process.env.THENEWSAPI_KEY.slice(0, 8) + '...)' : 'NOT SET'}`);
  console.log(`   NEWSAPI_AI_KEY: ${process.env.NEWSAPI_AI_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'}`);
  
  // Step 1: Sync from all providers
  const syncResult = await newsManager.syncAll();
  console.log(`✅ Sync: ${syncResult.total} new articles`);
  
  // Step 2: Process unprocessed articles with AI
  // AI decides if article should be published (importance)
  const { NewsPipeline } = await import('@/lib/news/services/news-pipeline.service');
  const processResult = await NewsPipeline.run(10); // Process up to 10 articles
  
  const duration = Date.now() - startTime;
  
  // Count published articles (visible on site)
  const publishedCount = await prisma.article.count({ 
    where: { 
      createdAt: { 
        gte: new Date(startTime) 
      } 
    } 
  });
  
  console.log(`✅ Complete in ${duration}ms`);
  console.log(`   Synced: ${syncResult.total}`);
  console.log(`   Processed: ${processResult.processed}`);
  console.log(`   Published to site: ${publishedCount}`);
  
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
    const result = await runSyncPipeline();
    
    // Notify admin about sync result
    await notifySyncResult({
      synced: result.sync.total,
      processed: result.process.processed,
      published: result.process.processed - result.process.skipped,
      duration: result.duration,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Pipeline completed',
      ...result,
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
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
