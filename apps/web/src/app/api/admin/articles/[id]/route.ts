import { NextRequest, NextResponse } from 'next/server';
import type { Difficulty, Importance } from '@prisma/client';
import prisma from '@/lib/prisma';
import { requireAdminApiAuth } from '@/lib/admin/auth';
import { parseJsonBody, updateArticleSchema } from '@/lib/admin/validation';

// GET - Single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminApiAuth(request);
  if (authError) return authError;

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
  const authError = await requireAdminApiAuth(request, { requireTrustedOrigin: true });
  if (authError) return authError;

  try {
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateArticleSchema);
    if (parsed.error) return parsed.error;

    const { title, slug, summary, content, imageUrl, categoryId, difficulty, importance, readingTime } =
      parsed.data;

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
        difficulty: difficulty as Difficulty | undefined,
        importance: importance as Importance | undefined,
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
  const authError = await requireAdminApiAuth(request, { requireTrustedOrigin: true });
  if (authError) return authError;

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
