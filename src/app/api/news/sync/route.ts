import { NextResponse } from 'next/server';
import { newsManager } from '@/lib/news/news-manager';

/**
 * News Sync API
 * 
 * Fetches articles from all registered providers.
 * 
 * @route GET /api/news/sync - Get sync status
 * @route POST /api/news/sync - Trigger sync
 */

export async function GET() {
  const status = newsManager.getStatus();
  
  return NextResponse.json({
    success: true,
    providers: status.providers,
    providerCount: status.providerCount,
    message: 'Use POST to trigger sync',
  });
}

export async function POST() {
  const startTime = Date.now();
  
  try {
    console.log('📥 Manual sync triggered...');
    
    const result = await newsManager.syncAll();
    const duration = Date.now() - startTime;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sync completed',
      duration: `${duration}ms`,
      ...result,
    });
  } catch (error) {
    console.error('❌ Sync failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sync failed',
      }, 
      { status: 500 }
    );
  }
}
