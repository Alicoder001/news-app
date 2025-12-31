import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, getRateLimitHeaders, RATE_LIMITS } from '@/lib/rate-limit';
import prisma from '@/lib/prisma';
import { TelegramService } from '@/lib/news/services/telegram.service';
import { notifyTelegramPost, notifyError } from '@/lib/news/services/admin-notification.service';

/**
 * Telegram Post Cron Endpoint
 * 
 * Every hour, selects the most important article from the last hour
 * and posts it to Telegram with internal website link.
 * 
 * @route GET /api/cron/telegram
 */

/**
 * Verify cron secret
 */
function verifyCronSecret(request: Request): boolean {
  const vercelCron = request.headers.get('x-vercel-cron');
  if (vercelCron === '1') {
    return true;
  }
  
  // Development rejimda har doim ruxsat
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

/**
 * Get app URL for article links
 */
function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://aishunos.uz';
}

/**
 * Select and post the most important article to Telegram
 */
async function postToTelegram(): Promise<{
  posted: boolean;
  articleId?: string;
  articleTitle?: string;
  articleUrl?: string;
  reason?: string;
}> {
  console.log('📱 Telegram post cron started...');
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  
  // DEV: 1 minut, PROD: 1 soat
  const filterMinutes = process.env.NODE_ENV === 'production' ? 60 : 1;
  const filterTime = new Date(Date.now() - filterMinutes * 60 * 1000);
  
  const candidates = await prisma.article.findMany({
    where: {
      createdAt: { gte: filterTime },
      telegramPosted: false,
    },
    include: {
      category: true,
    },
    orderBy: [
      { importance: 'desc' }, // CRITICAL > HIGH > MEDIUM > LOW
      { createdAt: 'desc' },
    ],
    take: 5, // Get top 5 candidates
  });
  
  if (candidates.length === 0) {
    console.log('📭 No new articles to post');
    return { posted: false, reason: 'No articles in last hour' };
  }
  
  // Select the most important article
  const article = candidates[0];
  console.log(`📰 Selected: "${article.title}" (${article.importance})`);
  
  // Build internal website link
  const appUrl = getAppUrl();
  const articleUrl = `${appUrl}/uz/articles/${article.slug}`;
  
  // Post to Telegram (static method)
  const messageId = await TelegramService.postArticle({
    title: article.title,
    summary: article.summary || '',
    url: articleUrl, // Internal link, not external!
    category: article.category?.name,
    difficulty: article.difficulty,
    importance: article.importance,
    readingTime: article.readingTime || undefined,
  });
  
  if (messageId) {
    // Mark as posted
    await prisma.article.update({
      where: { id: article.id },
      data: {
        telegramPosted: true,
        telegramPostId: messageId,
      },
    });
    
    console.log(`✅ Posted to Telegram: ${articleUrl}`);
    return {
      posted: true,
      articleId: article.id,
      articleTitle: article.title,
      articleUrl, // Admin notificationga link uchun
    };
  } else {
    console.warn(`⚠️ Telegram post skipped (credentials missing or failed)`);
    return { posted: false, reason: 'Telegram API failed or not configured' };
  }
}

/**
 * GET handler - cron trigger
 */
export async function GET(request: Request) {
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(`telegram:${clientIP}`, RATE_LIMITS.STRICT);

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
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const startTime = Date.now();
    const result = await postToTelegram();
    const duration = Date.now() - startTime;
    
    // Notify admin
    await notifyTelegramPost(result);
    
    return NextResponse.json({
      success: true,
      message: result.posted 
        ? `Posted: ${result.articleTitle}` 
        : `Skipped: ${result.reason}`,
      duration: `${duration}ms`,
      ...result,
    });
  } catch (error) {
    console.error('❌ Telegram cron failed:', error);
    
    // Notify admin about error
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
 * POST handler - for manual triggers
 */
export async function POST(request: Request) {
  return GET(request);
}
