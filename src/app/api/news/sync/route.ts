import { NextResponse } from 'next/server';
import { NewsManager } from '@/lib/news/news-manager';

export async function POST() {
  try {
    const manager = new NewsManager();
    await manager.syncAll();
    
    return NextResponse.json({ success: true, message: 'Sync started' });
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
  }
}
