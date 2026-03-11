import { listSources } from '@/lib/rss/source.service';
import { SourcesTable } from '@/components/admin/sources-table';

export default async function AdminSourcesPage() {
  const sources = await listSources();

  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Sources</h1>
      <SourcesTable initialSources={sources} />
    </main>
  );
}
