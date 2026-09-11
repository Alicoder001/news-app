import { listPublishedArticles } from '@/lib/content/article.service';
import { prisma } from '@/lib/db/prisma';
import { CategoryNav } from '@/components/category-nav';
import { ArticleCard, estimateReadingTime } from '@/components/article-card';

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    listPublishedArticles(50),
    prisma.article.groupBy({
      by: ['category'],
      where: { websitePublished: true },
      _count: { category: true },
    }),
  ]);

  const withReadingTime = articles.map((article) => ({
    ...article,
    readingTime: estimateReadingTime(article.fullArticle),
  }));

  return (
    <div className="space-y-6">
      <header className="space-y-2 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/50">Archive</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight title-gradient">Articles</h1>
        <p className="text-sm text-muted-foreground">
          {articles.length} verified {articles.length === 1 ? 'story' : 'stories'}
        </p>
      </header>

      <CategoryNav categories={categories.map((c) => ({ name: c.category, count: c._count.category }))} />

      {withReadingTime.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-7">
          {withReadingTime.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No published articles yet.</p>
      )}
    </div>
  );
}
