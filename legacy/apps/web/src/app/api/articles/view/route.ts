import { NextResponse } from 'next/server';
import {
  requestBackend,
} from '@/lib/api/backend-client';

/**
 * Article View Counter API
 * 
 * Optimized for minimal server load:
 * - Uses database-level atomic increment (no read-modify-write)
 * - Supports batch updates
 * - Client should debounce calls
 * 
 * @route POST /api/articles/view
 */

interface ViewRequest {
  slug: string;
}

interface BatchViewRequest {
  slugs: string[];
}

/**
 * Single article view increment
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if batch or single
    if (body.slugs && Array.isArray(body.slugs)) {
      return handleBatchView(body as BatchViewRequest);
    }
    
    return handleSingleView(body as ViewRequest);
  } catch (error) {
    console.error('View count error:', error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

/**
 * Handle single article view
 */
async function handleSingleView(body: ViewRequest) {
  if (!body.slug) {
    return NextResponse.json(
      { success: false, error: 'slug required' },
      { status: 400 }
    );
  }

  const backend = await requestBackend<{
    success: boolean;
    data?: {
      viewCount: number;
    };
  }>('/v1/articles/view', {
    method: 'POST',
    body: JSON.stringify({ slug: body.slug }),
  });

  if (!backend.ok || !backend.data?.success) {
    return NextResponse.json(
      { success: false, error: 'Backend API Error' },
      { status: backend.status || 502 }
    );
  }

  return NextResponse.json({
    success: true,
    viewCount: backend.data.data?.viewCount ?? 0,
  });
}

/**
 * Handle batch view increment (for multiple articles)
 * More efficient for homepage/list views
 */
async function handleBatchView(body: BatchViewRequest) {
  if (!body.slugs.length) {
    return NextResponse.json({ success: true, updated: 0 });
  }

  // Limit batch size to prevent abuse
  const slugs = body.slugs.slice(0, 20);
  let updated = 0;
  await Promise.all(
    slugs.map(async (slug) => {
      const response = await requestBackend<{ success?: boolean }>('/v1/articles/view', {
        method: 'POST',
        body: JSON.stringify({ slug }),
      });
      if (response.ok && response.data?.success) {
        updated += 1;
      }
    }),
  );

  return NextResponse.json({
    success: true,
    updated,
  });
}
