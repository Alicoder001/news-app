import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCorsHeaders } from '@/lib/security/cors';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
        rawArticle: {
          include: { source: true }
        }
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Article not found' } }, 
        { 
          status: 404,
          headers: getCorsHeaders(request, 'GET, OPTIONS')
        }
      );
    }

    const related = await prisma.article.findMany({
      where: article.categoryId
        ? {
            id: { not: article.id },
            categoryId: article.categoryId,
          }
        : {
            id: { not: article.id },
          },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    return NextResponse.json({ data: article, related }, {
      headers: getCorsHeaders(request, 'GET, OPTIONS'),
    });
  } catch (error) {
    console.error('API Single Article Error:', error);
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
