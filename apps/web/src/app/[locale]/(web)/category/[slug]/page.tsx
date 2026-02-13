import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CategoryNav } from '@/components/category-nav';
import { DifficultyBadge } from '@/components/badges';
import { getTranslations } from 'next-intl/server';
import { getArticles, getCategoryBySlug } from '@/lib/api/server-api';
import type { Difficulty } from '@news-app/api-types';

const ARTICLES_PER_PAGE = 12;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategoryData(slug: string, page: number = 1) {
  try {
    const categoryResponse = await getCategoryBySlug(slug);
    const category = categoryResponse.data.category as {
      id: string;
      slug: string;
      name: string;
      color?: string | null;
      description?: string | null;
    };
    const articlesResponse = await getArticles({
      page,
      limit: ARTICLES_PER_PAGE,
      category: slug,
    });
    const articlesData = articlesResponse.data as {
      articles?: Array<{
        id: string;
        slug: string;
        title: string;
        summary: string | null;
        imageUrl: string | null;
        createdAt: string;
        difficulty: Difficulty;
        category?: { name?: string; color?: string | null } | null;
      }>;
      pagination?: { totalPages?: number };
    };

    return {
      category,
      articles: articlesData.articles ?? [],
      totalPages: articlesData.pagination?.totalPages ?? 0,
      currentPage: page,
    };
  } catch {
    return null;
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const currentPage = Math.max(1, parseInt(sParams.page || '1', 10));
  
  const data = await getCategoryData(slug, currentPage);
  const t = await getTranslations('home');

  if (!data) {
    notFound();
  }

  const { category, articles } = data;

  return (
    <div className="space-y-8">
      <CategoryNav />
      
      <div className="flex flex-col gap-2 border-b border-foreground/5 pb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight flex items-center gap-3">
          <span style={{ color: category.color || 'inherit' }} className="w-2 h-8 rounded-full bg-current opacity-20" />
          {category.name}
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          {category.description || `${category.name} mavzusidagi eng so'nggi yangiliklar va tahlillar.`}
        </p>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <article key={article.id} className="group flex flex-col gap-3">
              <div className="relative aspect-[3/2] w-full rounded-lg overflow-hidden bg-muted">
                {article.imageUrl && (
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
                   <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span>
                   <DifficultyBadge difficulty={article.difficulty} />
                </div>

                <Link href={`/articles/${article.slug}`} className="block space-y-1.5">
                  <h3 className="text-base font-serif font-bold leading-snug group-hover:text-foreground/70 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted-foreground italic">Bu kategoriyada hozircha maqolalar mavjud emas.</p>
          </div>
        )}
      </main>
    </div>
  );
}
