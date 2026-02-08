import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCorsHeaders } from '@/lib/security/cors';

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ data: categories }, {
      headers: getCorsHeaders(request, 'GET, OPTIONS'),
    });
  } catch (error) {
    console.error('API Categories Error:', error);
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
