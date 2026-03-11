import { listPublishedArticles } from '@/lib/content/article.service';
import { withRouteHandler } from '@/lib/api/response';

export async function GET() {
  return withRouteHandler(async () => listPublishedArticles(20));
}
