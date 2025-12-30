import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DifficultyBadge } from '@/components/badges';
import { TGCategoryNav } from '@/components/tg-category-nav';
import { ArticleActions } from '@/components/article-actions';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCategoryArticles(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return null;
  }

  const articles = await prisma.article.findMany({
    where: {
      category: {
        slug: slug,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      category: true,
      rawArticle: { include: { source: true } }
    },
  });

  return { category, articles };
}

export default async function TelegramCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const data = await getCategoryArticles(slug);

  if (!data) {
    notFound();
  }

  const { category, articles } = data;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
       {/* Mobile Header */}
       <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/5 px-4 py-3">
          <div className="flex items-center justify-between">
             <h1 className="text-xl font-serif font-black tracking-tight">Antigravity.</h1>
             <div className="text-[10px] font-medium uppercase tracking-wider opacity-60">
                {category.name}
             </div>
          </div>
       </header>

       <TGCategoryNav />

      {/* Main Feed */}
      <main className="container px-8 mx-auto space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link 
                key={article.id} 
                href={`/tg/article/${article.slug}`}
                className="group block"
              >
                  <article className="flex flex-col gap-3 pb-4 border-b border-foreground/5 last:border-0 relative">
                     {/* Top Row: Content & Image */}
                     <div className="flex gap-4 items-center">
                         <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-bold text-foreground/40">
                                {article.category && (
                                    <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">
                                       {article.category.name}
                                    </span>
                                )}
                                <span className="opacity-30">•</span>
                                <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span>
                            </div>

                            <h2 className="text-base font-serif font-bold leading-snug group-hover:text-foreground/70 transition-colors line-clamp-3">
                               {article.title}
                            </h2>

                            {article.summary && (
                               <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                                  {article.summary}
                               </p>
                            )}
                         </div>

                         {/* Thumbnail */}
                         {article.imageUrl && (
                            <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-muted shrink-0 border border-foreground/5">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    sizes="80px"
                                />
                            </div>
                         )}
                     </div>

                     {/* Bottom Row: Actions */}
                     <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-muted-foreground">{article.readingTime || 4} min</span>
                            {article.difficulty && <DifficultyBadge difficulty={article.difficulty} />}
                        </div>
                        <ArticleActions title={article.title} slug={article.slug} />
                     </div>
                  </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/40 text-sm">Bu kategoriyada yangiliklar yo'q.</p>
            </div>
          )}
      </main>
    </div>
  );
}
