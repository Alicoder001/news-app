import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
        rawArticle: {
          include: { source: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// PUT - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      slug,
      summary,
      content,
      imageUrl,
      categoryId,
      difficulty,
      importance,
      readingTime,
      isFeatured,
      isPublished,
    } = body;

    // Check if article exists
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    // Check slug uniqueness if changed
    if (slug !== existing.slug) {
      const slugExists = await prisma.article.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ error: 'Bu slug allaqachon mavjud' }, { status: 400 });
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        summary: summary || null,
        content,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
        difficulty: difficulty ? difficulty.toUpperCase() : undefined,
        importance: importance ? importance.toUpperCase() : undefined,
        readingTime: readingTime || null,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if article exists
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Maqola o\'chirildi' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}