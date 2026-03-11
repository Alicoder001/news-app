import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminArticleById } from '@/lib/content/article.service';

export default async function AdminArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getAdminArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <main style={{ display: 'grid', gap: 18 }}>
      <div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{article.category}</div>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>{article.title}</h1>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 13, color: '#4b5563' }}>
          <span>Status: {article.status}</span>
          <span>Web: {article.websitePublished ? 'Published' : 'Pending'}</span>
          <span>Telegram: {article.telegramPublished ? 'Published' : 'Pending'}</span>
        </div>
      </div>

      <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18 }}>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>Pipeline trace</h2>
        <p style={{ marginBottom: 10 }}>Raw article: {article.rawArticle?.title ?? 'Missing raw article'}</p>
        {article.rawArticle && (
          <a href={article.rawArticle.canonicalUrl} target="_blank" rel="noreferrer">
            Open original source
          </a>
        )}
        {(article.holdReason || article.rejectReason || article.rawArticle?.holdReason || article.rawArticle?.rejectReason) && (
          <p style={{ marginTop: 12, color: '#b45309' }}>
            Reason: {article.holdReason || article.rejectReason || article.rawArticle?.holdReason || article.rawArticle?.rejectReason}
          </p>
        )}
      </section>

      <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18 }}>
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

      <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18 }}>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>Deliveries</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {article.deliveries.map((delivery) => (
            <div key={`${delivery.channel}-${delivery.externalId ?? delivery.status}`} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
              <div>{delivery.channel}: {delivery.status}</div>
              {delivery.errorMessage && <div style={{ color: '#b91c1c', marginTop: 4 }}>{delivery.errorMessage}</div>}
            </div>
          ))}
          {article.deliveries.length === 0 && <p>No delivery records yet.</p>}
        </div>
      </section>

      <div>
        <Link href={`/articles/${article.slug}`}>Open public article</Link>
      </div>
    </main>
  );
}
