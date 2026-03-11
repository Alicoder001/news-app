import Link from 'next/link';
import { listVerificationRecords } from '@/lib/verification/verification.service';

export default async function AdminVerificationPage() {
  const records = await listVerificationRecords();

  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Verification</h1>
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
              <th style={{ textAlign: 'left', padding: 12 }}>Article</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Confidence</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Source Count</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Trace</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600 }}>{record.rawArticle.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{record.rawArticle.source.name}</div>
                </td>
                <td style={{ padding: 12 }}>{record.status}</td>
                <td style={{ padding: 12 }}>{record.confidence}</td>
                <td style={{ padding: 12 }}>{record.sourceCount}</td>
                <td style={{ padding: 12 }}>
                  {record.rawArticle.article ? (
                    <Link href={`/admin/articles/${record.rawArticle.article.id}`}>Open article</Link>
                  ) : (
                    `${record.matchedSources.length} refs`
                  )}
                </td>
                <td style={{ padding: 12 }}>{record.notes || 'No notes'}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td style={{ padding: 12 }} colSpan={6}>
                  No verification records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
