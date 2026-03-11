import { getPublishedArticleBySlug } from '@/lib/content/article.service';
import { withRouteHandler } from '@/lib/api/response';
import { NotFoundError } from '@/lib/errors/domain';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  return withRouteHandler(async () => {
    const { slug } = await params;
    const article = await getPublishedArticleBySlug(slug);

    if (!article) {
      throw new NotFoundError('Article not found');
    }

    return article;
  });
}
