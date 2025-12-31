import { NextResponse } from 'next/server';
import { NewsPipeline } from '@/lib/news/services/news-pipeline.service';
import prisma from '@/lib/prisma';

/**
 * News Processing API
 * 
 * Processes raw articles through AI pipeline.
 * 
 * @route GET /api/news/process - Get processing status
 * @route POST /api/news/process - Trigger processing
 */

export async function GET() {
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

export async function POST() {
  const startTime = Date.now();
  
  try {
    console.log('🤖 Manual processing triggered...');
    
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
    console.error('❌ Pipeline failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Pipeline failed',
      }, 
      { status: 500 }
    );
  }
}
