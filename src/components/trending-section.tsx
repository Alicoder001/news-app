import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CategoryBadge } from './category-badge';
import { TrendingUp, Eye, Clock } from 'lucide-react';

async function getTrendingArticles() {
  return await prisma.article.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    orderBy: { viewCount: 'desc' },
    take: 5,
    include: {
      category: true,
    },
  });
}

export async function TrendingSection() {
  const trending = await getTrendingArticles();

  if (trending.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-orange-400" /> Trending
      </h3>
      <div className="space-y-4">
        {trending.map((article, index) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block"
          >
            <div className="flex gap-3">
              <span className="text-2xl font-bold text-foreground/20 group-hover:text-blue-400/50 transition-colors">
                {index + 1}
              </span>
              <div className="flex-1 space-y-1">
                {article.category && (
                  <CategoryBadge category={article.category} size="sm" showIcon={false} />
                )}
                <h4 className="text-sm font-semibold leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {article.viewCount}
                  </span>
                  {article.readingTime && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readingTime} min
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
