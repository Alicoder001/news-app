import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

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
            <div className="flex gap-4 items-start">
              <span className="text-xl font-light text-foreground/10 group-hover:text-foreground/20 transition-colors font-serif italic w-6 text-center mt-1">
                {index + 1}
              </span>
              
              <div className="space-y-2 grow">
                <h4 className="text-sm font-medium leading-snug group-hover:text-foreground/80 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-foreground/30">
                  <span>{article.category?.name}</span>
                  <span className="opacity-30">•</span>
                  <span>{article.viewCount} views</span>
                </div>
              </div>

              {article.imageUrl && (
                 <div className="w-16 h-12 relative rounded bg-muted overflow-hidden shrink-0">
                    <Image
                       src={article.imageUrl}
                       alt=""
                       fill
                       className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                       sizes="64px"
                    />
                 </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
