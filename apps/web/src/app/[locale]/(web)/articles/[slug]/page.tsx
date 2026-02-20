import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Tag } from '@/components/tag';
import { TelegramBackButton } from '@/components/telegram-back-button';
import { DifficultyBadge } from '@/components/badges';
import { 
  generateArticleMetadata, 
  generateArticleJsonLd,
  generateBreadcrumbJsonLd 
} from '@/lib/seo';
import { ShareButtons } from '@/components/share-buttons';
import { SITE_CONFIG } from '@/lib/config/social';
import { sanitizeHtml } from '@/lib/sanitize';
import { getArticleBySlug, getArticleSlugs } from '@/lib/api/server-api';
import type { Difficulty } from '@news-app/api-types';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string) {
  try {
    const response = await getArticleBySlug(slug);
    return response.data.article as {
      id: string;
      slug: string;
      title: string;
      summary: string | null;
      content: string;
      imageUrl: string | null;
      originalUrl: string;
      category?: { name: string; slug: string; color?: string | null } | null;
      tags: Array<{ id: string; name: string; slug: string }>;
      createdAt: string;
      updatedAt: string;
      readingTime?: number | null;
      wordCount?: number | null;
      difficulty?: Difficulty | null;
      rawArticle?: {
        publishedAt?: string | null;
        source?: { name: string } | null;
      } | null;
    };
  } catch {
    return null;
  }
}

/**
 * Generate Static Params for all articles
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  let articles: Array<{ slug: string }> = [];
  try {
    const response = await getArticleSlugs(100);
    articles = (response.data.articles as Array<{ slug: string }>) ?? [];
  } catch {
    articles = [];
  }

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

/**
 * Generate SEO Metadata
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Maqola topilmadi',
    };
  }
  
  return generateArticleMetadata({
    title: article.title,
    summary: article.summary,
    slug: article.slug,
    imageUrl: article.imageUrl,
    category: article.category?.name,
    tags: article.tags.map(t => t.name),
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = article.rawArticle?.publishedAt
    ? new Date(article.rawArticle.publishedAt).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Noma\'lum sana';

  // Generate JSON-LD for SEO
  const articleJsonLd = generateArticleJsonLd({
    title: article.title,
    summary: article.summary,
    content: article.content,
    slug: article.slug,
    imageUrl: article.imageUrl,
    category: article.category?.name,
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
    readingTime: article.readingTime,
    wordCount: article.wordCount,
    source: article.rawArticle?.source?.name ?? 'Unknown',
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Bosh sahifa', url: 'https://news-app.uz' },
    { name: article.category?.name || 'Maqolalar', url: `https://news-app.uz/category/${article.category?.slug || 'all'}` },
    { name: article.title, url: `https://news-app.uz/articles/${article.slug}` },
  ]);

  return (
    <div className="min-h-screen pb-20">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      
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
        <header className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider font-bold text-foreground/40">
            {article.category && (
              <Link 
                href={`/category/${article.category.slug}`}
                style={{ color: article.category.color || 'inherit' }} 
                className="text-foreground/80 hover:underline transition-all"
              >
                {article.category.name}
              </Link>
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

          <h1 className="text-3xl md:text-5xl lg:text-[2.75rem] font-serif font-bold leading-[1.1] tracking-tight text-foreground">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-lg leading-relaxed text-muted-foreground font-light border-l-2 border-foreground/10 pl-5 italic">
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
        <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />

        {/* Content */}
        <div className="prose prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:text-foreground/80 prose-p:leading-8 prose-li:text-foreground/80 prose-strong:text-foreground max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
          />
        </div>

        {/* Tags and Category combined as hashtags */}
        <div className="mt-16 pt-8 border-t border-foreground/5">
          <div className="flex flex-wrap gap-2">
            {/* Always show category as first hashtag */}
            {article.category && (
              <Tag 
                tag={{ 
                    name: article.category.name, 
                    slug: article.category.slug 
                }} 
                variant="subtle" 
                href={`/category/${article.category.slug}`}
              />
            )}
            
            {/* Show all article tags */}
            {article.tags.map((tag) => (
              <Tag 
                key={tag.id}
                tag={tag}
                variant="subtle"
              />
            ))}
          </div>
        </div>

        {/* Source Link */}
        <div className="mt-8 flex items-center justify-between text-xs text-foreground/40 border-t border-foreground/5 pt-6">
            <div className="flex items-center gap-2">
                <span>Manba:</span>
                <span className="font-medium text-foreground/60">{article.rawArticle?.source?.name ?? 'Unknown'}</span>
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

        {/* Share Section */}
        <div className="mt-8 pt-6 border-t border-foreground/5">
          <ShareButtons
            url={`${SITE_CONFIG.url}/uz/articles/${article.slug}`}
            title={article.title}
            summary={article.summary || undefined}
          />
        </div>
      </article>
    </div>
  );
}
