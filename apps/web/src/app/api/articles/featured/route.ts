import { NextResponse } from 'next/server';
import {
  CORS_HEADERS,
  requestBackend,
} from '@/lib/api/backend-client';

function parseBoundedLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.min(20, Math.max(1, parsed));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseBoundedLimit(searchParams.get('limit'));

    const backend = await requestBackend<{
      success: boolean;
      data: {
        articles: unknown[];
      };
    }>('/v1/articles/featured', {
      query: { limit },
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

    return NextResponse.json(backend.data.data.articles, {
      headers: CORS_HEADERS,
    }); 
  } catch (error) {
    console.error('API Featured Articles Error:', error);
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
