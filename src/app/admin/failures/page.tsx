import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';

export default async function AdminFailuresPage() {
  const rawArticles = await prisma.rawArticle.findMany({
    where: {
      processingState: {
        in: ['HOLD', 'REJECTED'],
      },
    },
    include: {
      source: true,
      article: true,
    },
    orderBy: { ingestedAt: 'desc' },
    take: 20,
  });

  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Failures and Holds</h1>
      <div
        style={{
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          background: '#ffffff',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 12 }}>Title</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Source</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Reason</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Trace</th>
            </tr>
          </thead>
          <tbody>
            {rawArticles.map((article) => (
              <tr key={article.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{article.title}</td>
                <td style={{ padding: 12 }}>{article.source.name}</td>
                <td style={{ padding: 12 }}>{article.processingState}</td>
                <td style={{ padding: 12 }}>{article.holdReason || article.rejectReason || 'No reason logged'}</td>
                <td style={{ padding: 12 }}>
                  {article.article ? <Link href={`/admin/articles/${article.article.id}`}>Open article</Link> : 'Raw only'}
                </td>
              </tr>
            ))}
            {rawArticles.length === 0 && (
              <tr>
                <td style={{ padding: 12 }} colSpan={5}>
                  No failed or held articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
