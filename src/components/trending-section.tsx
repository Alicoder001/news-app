import prisma from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function TrendingSection() {
  const t = await getTranslations('home');
  
  const trendingArticles = await prisma.article.findMany({
    take: 5,
    orderBy: {
      viewCount: 'desc'
    },
    include: {
      category: true,
    },
    where: {
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });

  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-4">
        {t('trending')}
      </h3>
      <div className="space-y-4">
            {trendingArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block"
          >
            <div className="flex gap-3 items-start min-h-[72px]">
              <span className="text-lg font-light text-foreground/10 group-hover:text-foreground/20 transition-colors font-serif italic w-4 text-center mt-0.5 shrink-0">
                {index + 1}
              </span>
              
              <div className="space-y-2 flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-snug group-hover:text-foreground/80 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-bold text-foreground/30">
                  <span>{article.category?.name}</span>
                  <span className="opacity-30">•</span>
                  <span>{article.viewCount} views</span>
                </div>
              </div>

              {article.imageUrl && (
                 <div className="w-12 h-12 relative rounded bg-muted overflow-hidden shrink-0">
                    <Image
                       src={article.imageUrl}
                       alt=""
                       fill
                       className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                       sizes="48px"
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
