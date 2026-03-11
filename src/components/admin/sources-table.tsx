'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type Source = {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  lastFetchedAt: string | Date | null;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: string;
};

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? 'Request failed');
  }

  return payload.data;
}

export function SourcesTable({ initialSources }: { initialSources: Source[] }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const { data: sources = initialSources, isFetching } = useQuery({
    queryKey: ['admin', 'sources'],
    queryFn: () => fetchJson<Source[]>('/api/admin/sources'),
    initialData: initialSources,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      fetchJson<Source>('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url }),
      }),
    onSuccess: async () => {
      setName('');
      setUrl('');
      setMessage('Source created.');
      await queryClient.invalidateQueries({ queryKey: ['admin', 'sources'] });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : 'Failed to create source');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (sourceId: string) =>
      fetchJson<Source>(`/api/admin/sources/${sourceId}/toggle`, {
        method: 'POST',
      }),
    onSuccess: async () => {
      setMessage('Source updated.');
      await queryClient.invalidateQueries({ queryKey: ['admin', 'sources'] });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : 'Failed to update source');
    },
  });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setMessage('');
          createMutation.mutate();
        }}
        style={{
          display: 'grid',
          gap: 10,
          padding: 16,
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          background: '#ffffff',
        }}
      >
        <div style={{ fontWeight: 700 }}>Add RSS Source</div>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Source name" style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }} />
        <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/feed.xml" style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }} />
        <button type="submit" disabled={createMutation.isPending} style={{ border: 'none', borderRadius: 12, padding: '10px 16px', background: '#111827', color: '#ffffff', cursor: createMutation.isPending ? 'not-allowed' : 'pointer', justifySelf: 'start' }}>
          {createMutation.isPending ? 'Creating...' : 'Create Source'}
        </button>
        {message && <div style={{ fontSize: 13, color: '#6b7280' }}>{message}</div>}
      </form>

      <div style={{ overflow: 'hidden', border: '1px solid #e5e7eb', borderRadius: 14, background: '#ffffff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Type</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Active</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Last Fetched</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{source.name}</td>
                <td style={{ padding: 12 }}>{source.type}</td>
                <td style={{ padding: 12 }}>{source.isActive ? 'Yes' : 'No'}</td>
                <td style={{ padding: 12 }}>{source.lastFetchedAt ? new Date(source.lastFetchedAt).toLocaleString() : 'Never'}</td>
                <td style={{ padding: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMessage('');
                      toggleMutation.mutate(source.id);
                    }}
                    disabled={toggleMutation.isPending}
                    style={{ border: '1px solid #d1d5db', borderRadius: 10, padding: '8px 10px', background: '#ffffff', cursor: toggleMutation.isPending ? 'not-allowed' : 'pointer' }}
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
            {sources.length === 0 && (
              <tr>
                <td style={{ padding: 12 }} colSpan={5}>
                  {isFetching ? 'Loading sources...' : 'No sources yet. Seed default sources first.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
