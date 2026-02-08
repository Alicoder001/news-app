import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCorsHeaders } from '@/lib/security/cors';

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parsePositiveInt(searchParams.get('limit'), 5), 20);

    const articles = await prisma.article.findMany({
      where: {
        importance: 'CRITICAL',
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ data: articles }, {
      headers: getCorsHeaders(request, 'GET, OPTIONS'),
    });
  } catch (error) {
    console.error('API Featured Articles Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } }, 
      { 
        status: 500,
        headers: getCorsHeaders(request, 'GET, OPTIONS')
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request, 'GET, OPTIONS'),
  });
}
