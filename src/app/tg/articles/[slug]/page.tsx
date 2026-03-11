import { notFound } from 'next/navigation';
import { getPublishedArticleBySlug } from '@/lib/content/article.service';

export default async function TelegramMiniAppArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main style={{ padding: 20 }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{article.category}</div>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>{article.title}</h1>
      {article.shortSummary && <p style={{ marginBottom: 16 }}>{article.shortSummary}</p>}
      <article
        dangerouslySetInnerHTML={{ __html: article.fullArticle }}
        style={{ lineHeight: 1.7, background: '#ffffff', padding: 16, borderRadius: 16 }}
      />
    </main>
  );
}
