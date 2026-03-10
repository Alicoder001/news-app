import { NextResponse } from 'next/server';
import {
  CORS_HEADERS,
  requestBackend,
} from '@/lib/api/backend-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const backend = await requestBackend<{
      success: boolean;
      data: {
        article: unknown;
      };
    }>(`/v1/articles/${slug}`);

    if (backend.status === 404) {
      return NextResponse.json(
        { error: 'Article not found' }, 
        { 
          status: 404,
          headers: CORS_HEADERS
        }
      );
    }

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Backend API Error' },
        {
          status: backend.status || 502,
          headers: CORS_HEADERS,
        }
      );
    }

    return NextResponse.json(backend.data.data.article, {
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('API Single Article Error:', error);
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
