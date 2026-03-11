import Link from 'next/link';
import { listPublishedArticles } from '@/lib/content/article.service';
import { prisma } from '@/lib/db/prisma';

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    listPublishedArticles(50),
    prisma.article.groupBy({
      by: ['category'],
      where: { websitePublished: true },
      _count: { category: true },
    }),
  ]);

  return (
    <main style={{ padding: 32, display: 'grid', gap: 18 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Articles</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {categories.map((category) => (
          <Link key={category.category} href={`/categories/${category.category}`} style={{ padding: '8px 12px', borderRadius: 999, background: '#ffffff', border: '1px solid #e5e7eb', textDecoration: 'none', color: '#111827' }}>
            {category.category} ({category._count.category})
          </Link>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 16 }}>
        {articles.map((article) => (
          <article
            key={article.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: 12, color: '#6b7280' }}>{article.category}</div>
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            {article.shortSummary && <p style={{ lineHeight: 1.6 }}>{article.shortSummary}</p>}
          </article>
        ))}
        {articles.length === 0 && <p>No published articles yet.</p>}
      </div>
    </main>
  );
}
