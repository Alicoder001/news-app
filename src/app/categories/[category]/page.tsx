import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { toPublicArticleDto } from '@/lib/content/dto';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const articles = (
    await prisma.article.findMany({
      where: {
        websitePublished: true,
        category,
      },
      orderBy: { websitePublishedAt: 'desc' },
    })
  ).map(toPublicArticleDto);

  return (
    <main style={{ padding: 32 }}>
      <div style={{ marginBottom: 16, color: '#6b7280' }}>Category</div>
      <h1 style={{ fontSize: 34, marginBottom: 18 }}>{category}</h1>
      <div style={{ display: 'grid', gap: 16 }}>
        {articles.map((article) => (
          <article key={article.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 20 }}>
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            {article.shortSummary && <p style={{ lineHeight: 1.6 }}>{article.shortSummary}</p>}
          </article>
        ))}
        {articles.length === 0 && <p>No published articles in this category yet.</p>}
      </div>
    </main>
  );
}
