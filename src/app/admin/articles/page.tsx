import Link from 'next/link';
import { listAdminArticles } from '@/lib/content/article.service';

export default async function AdminArticlesPage() {
  const articles = await listAdminArticles(20);

  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Articles</h1>
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
              <th style={{ textAlign: 'left', padding: 12 }}>Category</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Reason</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Web</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Telegram</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{article.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{article.slug}</div>
                </td>
                <td style={{ padding: 12 }}>{article.category}</td>
                <td style={{ padding: 12 }}>{article.status}</td>
                <td style={{ padding: 12 }}>{article.holdReason || article.rejectReason || 'Ready'}</td>
                <td style={{ padding: 12 }}>{article.websitePublished ? 'Published' : 'Pending'}</td>
                <td style={{ padding: 12 }}>{article.telegramPublished ? 'Published' : 'Pending'}</td>
                <td style={{ padding: 12 }}>
                  <Link href={`/admin/articles/${article.id}`}>Open</Link>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td style={{ padding: 12 }} colSpan={7}>
                  No articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
