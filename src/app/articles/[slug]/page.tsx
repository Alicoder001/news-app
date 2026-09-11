import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedArticleBySlug } from '@/lib/content/article.service';
import { sanitizeHtml } from '@/lib/content/sanitize';
import { TagBadge } from '@/components/badges';
import { ShareButtons } from '@/components/share-buttons';
import { estimateReadingTime } from '@/components/article-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article not found | ai_shunos',
    };
  }

  return {
    title: article.title + ' | ai_shunos',
    description: article.shortSummary ?? article.title,
    openGraph: {
      title: article.title,
      description: article.shortSummary ?? article.title,
      type: 'article',
      url: article.websiteUrl ?? '/articles/' + article.slug,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const publishedDate = article.websitePublishedAt
    ? new Date(article.websitePublishedAt).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : "Noma'lum sana";
  const readingTime = estimateReadingTime(article.fullArticle);

  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.shortSummary ?? article.title,
    datePublished: article.websitePublishedAt ?? undefined,
  });

  return (
    <div className="min-h-screen pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />

      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-foreground/40 hover:text-foreground transition-colors"
        >
          <span>←</span> All articles
        </Link>
      </div>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider font-bold text-foreground/40">
            <Link
              href={'/categories/' + encodeURIComponent(article.category)}
              className="text-accent hover:underline transition-all"
            >
              {article.category}
            </Link>
            <span className="w-1 h-1 rounded-full bg-foreground/20" />
            <span>{publishedDate}</span>
            <span className="w-1 h-1 rounded-full bg-foreground/20" />
            <span>{readingTime} min o&apos;qish</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-[2.75rem] font-serif font-bold leading-[1.1] tracking-tight text-foreground">
            {article.title}
          </h1>

          {article.shortSummary && (
            <p className="text-lg leading-relaxed text-muted-foreground font-light border-l-2 border-foreground/10 pl-5 italic">
              {article.shortSummary}
            </p>
          )}
        </header>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />

        <div className="article-content prose prose-lg prose-headings:font-serif prose-headings:font-bold max-w-none">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.fullArticle) }} />
        </div>

        {article.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-foreground/5">
            <div className="flex flex-wrap gap-2">
              <TagBadge tag={article.category} variant="subtle" />
              {article.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} variant="subtle" />
              ))}
            </div>
          </div>
        )}

        {article.sourceReferences.length > 0 && (
          <div className="mt-8 glass-card rounded-2xl p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/60 mb-3">
              Source references
            </h2>
            <ul className="space-y-2">
              {article.sourceReferences.map((reference) => (
                <li key={reference.name + '-' + reference.url} className="text-sm">
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    {reference.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-foreground/5">
          <ShareButtons url={'/articles/' + article.slug} title={article.title} />
        </div>
      </article>
    </div>
  );
}
