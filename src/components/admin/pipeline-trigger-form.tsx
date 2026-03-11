'use client';

import { useState } from 'react';

export function PipelineTriggerForm() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/admin/pipeline/run', {
        method: 'POST',
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) {
        setStatus(payload.error ?? 'Pipeline trigger failed');
      } else {
        setStatus('Pipeline run completed or queued successfully');
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unknown pipeline error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        style={{
          border: 'none',
          borderRadius: 12,
          padding: '10px 16px',
          background: '#111827',
          color: '#ffffff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Running...' : 'Run Pipeline'}
      </button>
      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  );
}
