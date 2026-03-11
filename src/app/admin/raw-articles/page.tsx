import { listRawArticles } from '@/lib/rss/raw-article.service';

export default async function AdminRawArticlesPage() {
  const articles = await listRawArticles();

  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Raw Articles</h1>
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
              <th style={{ textAlign: 'left', padding: 12 }}>Processed</th>
              <th style={{ textAlign: 'left', padding: 12 }}>State</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Reason</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Ingested</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{article.title}</td>
                <td style={{ padding: 12 }}>{article.source.name}</td>
                <td style={{ padding: 12 }}>{article.isProcessed ? 'Yes' : 'No'}</td>
                <td style={{ padding: 12 }}>{article.processingState}</td>
                <td style={{ padding: 12 }}>{article.holdReason || article.rejectReason || '-'}</td>
                <td style={{ padding: 12 }}>{new Date(article.ingestedAt).toLocaleString()}</td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td style={{ padding: 12 }} colSpan={6}>
                  No raw articles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
