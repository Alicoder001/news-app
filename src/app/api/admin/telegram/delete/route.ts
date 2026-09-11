import { prisma } from '@/lib/db/prisma';
import { withRouteHandler } from '@/lib/api/response';
import { ValidationError } from '@/lib/errors/domain';
import { deleteTelegramPost } from '@/lib/telegram/telegram-publish.service';

export async function POST(request: Request) {
  return withRouteHandler(async () => {
    const body = (await request.json().catch(() => null)) as { articleId?: unknown } | null;
    const articleId = typeof body?.articleId === 'string' ? body.articleId : null;

    if (!articleId) {
      throw new ValidationError('articleId is required');
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } });

    if (!article) {
      throw new ValidationError(`Article not found: ${articleId}`);
    }

    if (!article.telegramMessageId) {
      throw new ValidationError('Article has no Telegram message to delete');
    }

    const result = await deleteTelegramPost(article.telegramMessageId);

    if (!result.success) {
      throw new ValidationError(result.error ?? 'Telegram delete failed');
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { telegramPublished: false, telegramPublishedAt: null, telegramMessageId: null },
    });

    return { articleId: article.id, deleted: true };
  });
}
