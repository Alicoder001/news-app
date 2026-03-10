import { NextResponse } from 'next/server';
import {
  CORS_HEADERS,
  requestBackend,
} from '@/lib/api/backend-client';

export async function GET() {
  try {
    const backend = await requestBackend<{
      success: boolean;
      data: {
        categories: unknown[];
      };
    }>('/v1/categories');

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Backend API Error' },
        {
          status: backend.status || 502,
          headers: CORS_HEADERS,
        }
      );
    }

    const categories = backend.data.data.categories;

    return NextResponse.json(categories, {
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('API Categories Error:', error);
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
