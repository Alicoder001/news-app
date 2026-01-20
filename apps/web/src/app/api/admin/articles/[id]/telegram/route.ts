import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TelegramService } from '@/lib/news/services/telegram.service';

// POST - Send article to Telegram
export async function POST(
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
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    const telegramArticle = {
      title: article.title,
      summary: article.summary || article.title,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aishunos.uz'}/articles/${article.slug}`,
      category: article.category?.name,
      imageUrl: article.imageUrl || undefined,
    };
    await TelegramService.postArticle(telegramArticle);

    return NextResponse.json({ success: true, message: 'Telegram kanalga yuborildi' });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json({ error: 'Telegram\'ga yuborishda xatolik' }, { status: 500 });
  }
}