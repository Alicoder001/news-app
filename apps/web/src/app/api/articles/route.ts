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
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const limit = Math.min(parsePositiveInt(searchParams.get('limit'), 10), 50);
    const category = searchParams.get('category');
    
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: category ? {
          category: {
            slug: category
          }
        } : {},
        include: {
          category: true,
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: category ? {
          category: {
            slug: category
          }
        } : {},
      }),
    ]);
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      data: articles,
      pagination: {
        page,
        pageSize: limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }, {
      headers: getCorsHeaders(request, 'GET, OPTIONS'),
    });
  } catch (error) {
    console.error('API Articles Error:', error);
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
