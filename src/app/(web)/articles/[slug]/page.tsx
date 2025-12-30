import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TelegramBackButton } from '@/components/telegram-back-button';
import { DifficultyBadge } from '@/components/badges';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: true,
      rawArticle: {
        include: {
          source: true,
        },
      },
    },
  });

  if (!article) {
    return null;
  }

  return article;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = article.rawArticle.publishedAt
    ? new Date(article.rawArticle.publishedAt).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Noma\'lum sana';

  return (
    <div className="min-h-screen pb-20">
      <TelegramBackButton />
      
      {/* Navigation */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-foreground/40 hover:text-foreground transition-colors"
        >
          <span>←</span> Bosh sahifa
        </Link>
      </div>

      <article className="max-w-3xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider font-bold text-foreground/40">
            {article.category && (
              <span style={{ color: article.category.color || 'inherit' }} className="text-foreground/80">
                {article.category.name}
              </span>
            )}
            <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
            <span>{publishedDate}</span>
            <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
            <span>{article.readingTime || 4} min o'qish</span>
            {article.difficulty && (
               <>
                 <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
                 <DifficultyBadge difficulty={article.difficulty} />
               </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-serif font-bold leading-[1.1] tracking-tight text-foreground">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-light border-l-2 border-foreground/10 pl-5 italic">
              {article.summary}
            </p>
          )}

           {/* Hero Image */}
           {article.imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-muted mt-8 shadow-sm border border-foreground/5">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              />
            </div>
          )}
        </header>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-12" />

        {/* Content */}
        <div className="prose prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:text-foreground/80 prose-p:leading-8 prose-li:text-foreground/80 prose-strong:text-foreground max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-foreground/5">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span 
                  key={tag.id}
                  className="px-3 py-1 bg-foreground/5 text-foreground/60 text-xs rounded-full font-medium hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source Link */}
        <div className="mt-8 flex items-center justify-between text-xs text-foreground/40 border-t border-foreground/5 pt-6">
            <div className="flex items-center gap-2">
                <span>Manba:</span>
                <span className="font-medium text-foreground/60">{article.rawArticle.source.name}</span>
            </div>
            <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
                Asl manbani o'qish <span>↗</span>
            </a>
        </div>
      </article>
    </div>
  );
}
