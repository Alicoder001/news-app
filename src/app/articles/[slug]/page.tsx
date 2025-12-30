import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TelegramBackButton } from '@/components/telegram-back-button';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
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
    <div className="min-h-screen">
      <TelegramBackButton />
      {/* Back Button */}
      <div className="container px-4 mx-auto pt-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-8"
        >
          <span>←</span> Orqaga
        </Link>
      </div>

      {/* Article Header */}
      <header className="container px-4 mx-auto max-w-4xl mb-12">
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-foreground/40 mb-6">
          <span>{article.rawArticle.source.name}</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
          <span>{publishedDate}</span>
          <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
          <span className="text-blue-400">IT TRENDS</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.summary && (
          <p className="text-xl text-foreground/70 leading-relaxed font-light italic border-l-2 border-blue-400/30 pl-6">
            {article.summary}
          </p>
        )}
      </header>

      {/* Article Content */}
      <main className="container px-4 mx-auto max-w-4xl pb-24">
        <article className="prose prose-invert prose-lg max-w-none">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Original Source Link */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Asl manbani o'qish <span>↗</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="text-sm font-medium tracking-tight">© 2024 ANTIGRAVITY NEWS</div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-foreground transition-colors">
              Telegram API
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              RSS Feed
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
