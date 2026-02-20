import { NextResponse } from 'next/server';
import {
  CORS_HEADERS,
  requestBackend,
} from '@/lib/api/backend-client';

function parseBoundedInt(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseBoundedInt(searchParams.get('page'), 1, 1, 1000);
    const limit = parseBoundedInt(searchParams.get('limit'), 10, 1, 50);
    const category = searchParams.get('category');

    const backend = await requestBackend<{
      success: boolean;
      data: {
        articles: unknown[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      };
    }>('/v1/articles', {
      query: { page, limit, category: category ?? undefined },
    });

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Backend API Error' },
        {
          status: backend.status || 502,
          headers: CORS_HEADERS,
        }
      );
    }

    const payload = backend.data.data;
    
    return NextResponse.json({
      articles: payload.articles,
      pagination: {
        page: payload.pagination.page,
        limit: payload.pagination.limit,
        total: payload.pagination.total,
        totalPages: payload.pagination.totalPages,
        hasNextPage: payload.pagination.hasNextPage,
        hasPrevPage: payload.pagination.hasPrevPage,
      }
    }, {
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('API Articles Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { 
        status: 500,
        headers: CORS_HEADERS
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
