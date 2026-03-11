'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type PipelineRun = {
  id: string;
  status: string;
  startedAt: string | Date;
  articlesFound: number;
  articlesProcessed: number;
  articlesPublishedWeb: number;
  articlesPublishedTelegram: number;
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

export function PipelineRunsPanel({ initialRuns }: { initialRuns: PipelineRun[] }) {
  const queryClient = useQueryClient();
  const { data: runs = initialRuns, isFetching } = useQuery({
    queryKey: ['admin', 'pipeline-runs'],
    queryFn: () => fetchJson<PipelineRun[]>('/api/admin/pipeline/runs'),
    initialData: initialRuns,
    refetchInterval: 30_000,
  });

  const triggerMutation = useMutation({
    mutationFn: () => fetchJson('/api/admin/pipeline/run', { method: 'POST' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'pipeline-runs'] });
    },
  });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={() => triggerMutation.mutate()}
          disabled={triggerMutation.isPending}
          style={{ border: 'none', borderRadius: 12, padding: '10px 16px', background: '#111827', color: '#ffffff', cursor: triggerMutation.isPending ? 'not-allowed' : 'pointer' }}
        >
          {triggerMutation.isPending ? 'Running...' : 'Run Pipeline'}
        </button>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {triggerMutation.isError
            ? triggerMutation.error instanceof Error
              ? triggerMutation.error.message
              : 'Pipeline trigger failed'
            : isFetching
              ? 'Refreshing runs...'
              : 'Recent runs stay synced every 30 seconds.'}
        </span>
      </div>

      <div style={{ overflow: 'hidden', border: '1px solid #e5e7eb', borderRadius: 14, background: '#ffffff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Started</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Found</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Processed</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Web</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Telegram</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: 12 }}>{run.status}</td>
                <td style={{ padding: 12 }}>{new Date(run.startedAt).toLocaleString()}</td>
                <td style={{ padding: 12 }}>{run.articlesFound}</td>
                <td style={{ padding: 12 }}>{run.articlesProcessed}</td>
                <td style={{ padding: 12 }}>{run.articlesPublishedWeb}</td>
                <td style={{ padding: 12 }}>{run.articlesPublishedTelegram}</td>
              </tr>
            ))}
            {runs.length === 0 && (
              <tr>
                <td style={{ padding: 12 }} colSpan={6}>
                  No pipeline runs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
