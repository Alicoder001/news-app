import prisma from '@/lib/prisma';
import Link from 'next/link';

export async function TrendingSection() {
  const trendingArticles = await prisma.article.findMany({
    take: 5,
    orderBy: {
      viewCount: 'desc'
    },
    include: {
      category: true,
      rawArticle: { include: { source: true } }
    },
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });

  return (
    <section>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-6">
        Trending Now
      </h3>
      <div className="space-y-6">
        {trendingArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group block"
          >
            <div className="flex gap-4">
              <span className="text-xl font-light text-foreground/10 group-hover:text-foreground/20 transition-colors font-serif italic">
                {index + 1}
              </span>
              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-snug group-hover:text-foreground/80 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-foreground/30">
                  <span>{article.category?.name}</span>
                  <span className="opacity-30">•</span>
                  <span>{article.viewCount} views</span>
                  {article.readingTime && (
                    <>
                      <span className="opacity-30">•</span>
                      <span>{article.readingTime} min</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
