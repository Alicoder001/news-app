import prisma from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CategoryNav } from '@/components/category-nav';
import { DifficultyBadge } from '@/components/badges';

const ARTICLES_PER_PAGE = 12;

interface TagPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTagData(slug: string, page: number = 1) {
  const skip = (page - 1) * ARTICLES_PER_PAGE;

  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    return null;
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: {
        tags: {
          some: {
            slug: slug,
          },
        },
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.article.count({
      where: {
        tags: {
          some: {
            slug: slug,
          },
        },
      },
    }),
  ]);

  return {
    tag,
    articles,
    totalPages: Math.ceil(totalCount / ARTICLES_PER_PAGE),
    currentPage: page,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const currentPage = Math.max(1, parseInt(sParams.page || '1', 10));
  
  const data = await getTagData(slug, currentPage);

  if (!data) {
    notFound();
  }

  const { tag, articles } = data;

  return (
    <div className="space-y-8">
      <CategoryNav />
      
      <div className="flex flex-col gap-2 border-b border-foreground/5 pb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight flex items-center gap-3">
          <span className="text-blue-500 opacity-50">#</span>
          {tag.name}
        </h1>
        <p className="text-muted-foreground text-sm">
          #{tag.name} hashtagi ostidagi maqolalar ro'yxati.
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
                   {article.category && (
                     <span style={{ color: article.category.color || 'inherit' }} className="brightness-90">
                       {article.category.name}
                     </span>
                   )}
                   <span>{new Date(article.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })}</span>
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
                
                <div className="pt-1 border-t border-foreground/5 mt-2">
                   <DifficultyBadge difficulty={article.difficulty} />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-muted-foreground italic">Ushbu hashtag bilan maqolalar topilmadi.</p>
          </div>
        )}
      </main>
    </div>
  );
}
