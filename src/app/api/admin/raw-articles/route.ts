import { listRawArticles } from '@/lib/rss/raw-article.service';
import { withRouteHandler } from '@/lib/api/response';

export async function GET() {
  return withRouteHandler(async () => listRawArticles());
}
