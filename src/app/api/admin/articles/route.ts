import { listAdminArticles } from '@/lib/content/article.service';
import { withRouteHandler } from '@/lib/api/response';

export async function GET() {
  return withRouteHandler(async () => listAdminArticles());
}
