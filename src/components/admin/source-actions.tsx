'use client';

import { useState } from 'react';

export function SourceActions({ sourceId }: { sourceId: string }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSource = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/sources/${sourceId}/toggle`, {
        method: 'POST',
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) {
        setMessage(payload.error ?? 'Toggle failed');
      } else {
        setMessage('Updated');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        onClick={toggleSource}
        disabled={loading}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: 10,
          padding: '8px 10px',
          background: '#ffffff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Saving...' : 'Toggle'}
      </button>
      {message && <span style={{ fontSize: 12, color: '#6b7280' }}>{message}</span>}
    </div>
  );
}
