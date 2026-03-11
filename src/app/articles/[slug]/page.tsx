import { notFound } from 'next/navigation';
import { getPublishedArticleBySlug } from '@/lib/content/article.service';
import type { Metadata } from 'next';

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
    title: `${article.title} | ai_shunos`,
    description: article.shortSummary ?? article.title,
    openGraph: {
      title: article.title,
      description: article.shortSummary ?? article.title,
      type: 'article',
      url: article.websiteUrl ?? `/articles/${article.slug}`,
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

  return (
    <main style={{ padding: 32, maxWidth: 860 }}>
      <div style={{ marginBottom: 12, fontSize: 13, color: '#6b7280' }}>{article.category}</div>
      <h1 style={{ fontSize: 36, marginBottom: 16 }}>{article.title}</h1>
      {article.shortSummary && (
        <p style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 20 }}>{article.shortSummary}</p>
      )}
      <article
        dangerouslySetInnerHTML={{ __html: article.fullArticle }}
        style={{ lineHeight: 1.8, background: '#ffffff', padding: 24, borderRadius: 16 }}
      />
      <section style={{ marginTop: 18, background: '#ffffff', padding: 20, borderRadius: 16, border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>Source references</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {article.sourceReferences.map((reference) => (
            <li key={`${reference.name}-${reference.url}`} style={{ marginBottom: 8 }}>
              <a href={reference.url} target="_blank" rel="noreferrer">
                {reference.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
