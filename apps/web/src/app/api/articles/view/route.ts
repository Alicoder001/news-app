import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

  // Atomic increment - no read-modify-write race condition
  const updated = await prisma.article.update({
    where: { slug: body.slug },
    data: {
      viewCount: { increment: 1 },
    },
    select: { viewCount: true },
  });

  return NextResponse.json({
    success: true,
    viewCount: updated.viewCount,
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

  // Use transaction for atomic batch update
  const result = await prisma.article.updateMany({
    where: { slug: { in: slugs } },
    data: {
      viewCount: { increment: 1 },
    },
  });

  return NextResponse.json({
    success: true,
    updated: result.count,
  });
}
