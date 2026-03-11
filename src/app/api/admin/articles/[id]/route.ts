import { getAdminArticleById } from '@/lib/content/article.service';
import { withRouteHandler } from '@/lib/api/response';
import { NotFoundError } from '@/lib/errors/domain';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withRouteHandler(async () => {
    const { id } = await params;
    const article = await getAdminArticleById(id);

    if (!article) {
      throw new NotFoundError('Admin article not found');
    }

    return article;
  });
}
