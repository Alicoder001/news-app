import { prisma } from '@/lib/db/prisma';
import { withRouteHandler } from '@/lib/api/response';
import { ValidationError } from '@/lib/errors/domain';
import { markTelegramPublished } from '@/lib/publish/article-publish.service';
import { publishTelegramPost } from '@/lib/telegram/telegram-publish.service';

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

    const sourceRefs = Array.isArray(article.sourceReferences)
      ? (article.sourceReferences as Array<{ name?: unknown; url?: unknown }>)
          .filter((ref) => typeof ref?.url === 'string')
          .map((ref) => ({ name: typeof ref?.name === 'string' ? ref.name : 'Manba', url: ref.url as string }))
      : null;

    const result = await publishTelegramPost({
      articleId: article.id,
      title: article.title,
      shortSummary: article.shortSummary ?? article.shortPost ?? undefined,
      websiteUrl: article.websiteUrl,
      category: article.category,
      tags: article.tags,
      sourceRefs,
    });

    if (!result.success) {
      throw new ValidationError(result.error ?? 'Telegram publish failed');
    }

    await markTelegramPublished(article.id, result.messageId ?? 'pending');

    return { articleId: article.id, messageId: result.messageId };
  });
}
