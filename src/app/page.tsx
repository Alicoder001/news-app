import Link from 'next/link';
import { listPublishedArticles } from '@/lib/content/article.service';
import { prisma } from '@/lib/db/prisma';

export default async function HomePage() {
  const [latestArticles, categories] = await Promise.all([
    listPublishedArticles(6),
    prisma.article.groupBy({
      by: ['category'],
      where: { websitePublished: true },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    }),
  ]);

  return (
    <main style={{ padding: 32, display: 'grid', gap: 28 }}>
      <section style={{ padding: 28, borderRadius: 24, background: 'linear-gradient(135deg, #ecfeff, #f8fafc 60%, #fef3c7)', border: '1px solid #dbeafe' }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: '#0f766e', marginBottom: 10 }}>AI news, verified</div>
          <h1 style={{ fontSize: 42, marginBottom: 14 }}>ai_shunos daily pipeline for Uzbek tech coverage</h1>
          <p style={{ maxWidth: 620, lineHeight: 1.7, color: '#374151', marginBottom: 18 }}>
            Har bir maqola RSS orqali yig‘iladi, kamida 2 manba bilan solishtiriladi va website-first publish oqimi bilan chiqariladi.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/articles" style={{ padding: '10px 16px', background: '#111827', color: '#ffffff', borderRadius: 999, textDecoration: 'none' }}>Latest articles</Link>
            <Link href="/tg" style={{ padding: '10px 16px', background: '#ffffff', color: '#111827', borderRadius: 999, textDecoration: 'none', border: '1px solid #d1d5db' }}>Mini App view</Link>
          </div>
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 26 }}>Popular categories</h2>
          <Link href="/articles">Browse all</Link>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {categories.map((category) => (
            <Link key={category.category} href={`/categories/${category.category}`} style={{ padding: '10px 14px', borderRadius: 999, background: '#ffffff', border: '1px solid #e5e7eb', textDecoration: 'none', color: '#111827' }}>
              {category.category} ({category._count.category})
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 26, marginBottom: 12 }}>Latest verified stories</h2>
        <div style={{ display: 'grid', gap: 16 }}>
          {latestArticles.map((article, index) => (
            <article key={article.id} style={{ background: index === 0 ? '#111827' : '#ffffff', color: index === 0 ? '#ffffff' : '#111827', border: '1px solid #e5e7eb', borderRadius: 18, padding: 22 }}>
              <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.8 }}>{article.category}</div>
              <h3 style={{ fontSize: 24, marginBottom: 10 }}>
                <Link href={`/articles/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {article.title}
                </Link>
              </h3>
              {article.shortSummary && <p style={{ lineHeight: 1.7, color: index === 0 ? '#e5e7eb' : '#4b5563' }}>{article.shortSummary}</p>}
            </article>
          ))}
          {latestArticles.length === 0 && <p>No published articles yet.</p>}
        </div>
      </section>
    </main>
  );
}
