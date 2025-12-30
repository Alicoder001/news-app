import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CategoryBadge } from '@/components/category-badge';
import { Tag } from '@/components/tag';

async function getArticles() {
  return await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      category: true,
      tags: true,
    },
  });
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container px-4 mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wide uppercase rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-in text-blue-400">
            Insights for the Future
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight gradient-text">
            IT News, Deciphered.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-foreground/60 leading-relaxed italic font-light">
            "Context matters more than speed. We filter the noise to bring you the signal."
          </p>
        </div>
      </section>

      {/* Articles Feed */}
      <main className="flex-grow container px-4 mx-auto pb-24 max-w-4xl">
        <div className="space-y-12">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <Link href={`/articles/${article.slug}`}>
                  <div className="flex flex-col md:flex-row gap-8 items-start p-6 rounded-2xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10">
                    <div className="flex-1 space-y-4">
                      {/* Metadata Row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {article.category && (
                          <CategoryBadge category={article.category} size="sm" />
                        )}
                        <div className="flex items-center gap-2 text-xs text-foreground/40">
                          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                          {article.readingTime && (
                            <>
                              <span>•</span>
                              <span>⏱️ {article.readingTime} daqiqa</span>
                            </>
                          )}
                          {article.viewCount > 0 && (
                            <>
                              <span>•</span>
                              <span>👁️ {article.viewCount}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors tracking-tight leading-snug">
                        {article.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-lg text-foreground/60 leading-relaxed font-light line-clamp-3">
                        {article.summary}
                      </p>

                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Tag key={tag.id} tag={tag} variant="subtle" />
                          ))}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="pt-2 flex items-center gap-2 text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                        Read Analysis <span>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-foreground/40 text-lg">Hozircha yangiliklar yo'q. Pipeline ishga tushishini kuting.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="text-sm font-medium tracking-tight">© 2024 ANTIGRAVITY NEWS</div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-foreground transition-colors">Telegram API</a>
            <a href="#" className="hover:text-foreground transition-colors">RSS Feed</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
