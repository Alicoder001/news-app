import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Create new source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, url, isActive } = body;

    const source = await prisma.newsSource.create({
      data: {
        name,
        type: type || 'RSS',
        url,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}