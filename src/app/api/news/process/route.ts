import { NextResponse } from 'next/server';
import { NewsPipeline } from '@/lib/news/services/news-pipeline.service';

export async function POST() {
  try {
    await NewsPipeline.run();
    return NextResponse.json({ success: true, message: 'Pipeline ran' });
  } catch (error) {
    console.error('Pipeline failed:', error);
    return NextResponse.json({ success: false, error: 'Pipeline failed' }, { status: 500 });
  }
}
