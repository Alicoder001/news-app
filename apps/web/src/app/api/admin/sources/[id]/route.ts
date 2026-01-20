import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT - Update source
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, url, isActive } = body;

    const source = await prisma.newsSource.update({
      where: { id },
      data: {
        name,
        type,
        url,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(source);
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// PATCH - Toggle source active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const existing = await prisma.newsSource.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Manba topilmadi' }, { status: 404 });
    }

    const source = await prisma.newsSource.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return NextResponse.json(source);
  } catch (error) {
    console.error('Error toggling source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// DELETE - Delete source
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.newsSource.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}