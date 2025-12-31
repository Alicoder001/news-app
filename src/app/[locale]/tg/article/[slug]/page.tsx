import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { TelegramBackButton } from '@/components/telegram-back-button';
import { DifficultyBadge } from '@/components/badges';
import { ArticleActions } from '@/components/article-actions';

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

export default async function TelegramArticlePage({ params }: ArticlePageProps) {
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
    <div className="min-h-screen pb-20 bg-background text-foreground">
      <TelegramBackButton />
      
      {/* Navigation */}
      <div className="container px-8 mx-auto pt-6 mb-6">
        <Link
          href="/tg"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-foreground/40 hover:text-foreground transition-colors"
        >
          <span>←</span> Orqaga
        </Link>
      </div>

      <article className="container px-8 mx-auto max-w-2xl">


        {/* Header Section */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-wider font-bold text-foreground/40">
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
              <div className="flex items-center gap-2">
                 <Link 
                    href={`/article/${article.slug}`}
                    target="_blank" 
                    className="p-1.5 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Webda o'qish"
                 >
                    <Globe className="w-4 h-4" />
                 </Link>
                 <ArticleActions title={article.title} slug={article.slug} />
              </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold leading-tight tracking-tight text-foreground">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-base leading-relaxed text-muted-foreground font-light border-l-[1.5px] border-foreground/10 pl-4 italic">
              {article.summary}
            </p>
          )}

           {/* Hero Image */}
           {article.imageUrl && (
            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted mt-6 shadow-sm border border-foreground/5">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}
        </header>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />

        {/* Content */}
        <div className="prose prose-base prose-headings:font-serif prose-headings:font-bold prose-p:text-foreground/80 prose-p:leading-7 prose-li:text-foreground/80 prose-strong:text-foreground max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-foreground/5">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span 
                  key={tag.id}
                  className="px-2.5 py-1 bg-foreground/5 text-foreground/60 text-[10px] rounded-full font-medium"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source Link */}
        <div className="mt-6 flex items-center justify-between text-xs text-foreground/40 border-t border-foreground/5 pt-4">
            <div className="flex items-center gap-1.5">
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
      
      {/* Bottom Actions */}
      <div className="container px-8 mx-auto mt-12 border-t border-foreground/5 pt-8 text-center">
            <Link 
                href={`/article/${article.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-xs font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest bg-foreground/[0.02] px-4 py-2 rounded-full"
            >
                <Globe className="w-3 h-3" />
                <span>Saytda o'qish</span>
            </Link>
      </div>
      
      {/* Spacer for bottom safe area if needed */}
      <div className="h-8" />
    </div>
  );
}
