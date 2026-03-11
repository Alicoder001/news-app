import { prisma } from '@/lib/db/prisma';
import { withRouteHandler } from '@/lib/api/response';

export async function GET() {
  return withRouteHandler(async () => {
    const categories = await prisma.article.groupBy({
      by: ['category'],
      where: { websitePublished: true },
      _count: {
        category: true,
      },
    });

    return categories;
  });
}
