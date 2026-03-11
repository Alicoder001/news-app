'use client';

import { useState } from 'react';

export function SourceCreateForm() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, url }),
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) {
        setMessage(payload.error ?? 'Failed to create source');
      } else {
        setName('');
        setUrl('');
        setMessage('Source created');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gap: 10,
        marginBottom: 18,
        padding: 16,
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        background: '#ffffff',
      }}
    >
      <div style={{ fontWeight: 700 }}>Add RSS Source</div>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Source name"
        style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}
      />
      <input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://example.com/feed.xml"
        style={{ padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          border: 'none',
          borderRadius: 12,
          padding: '10px 16px',
          background: '#111827',
          color: '#ffffff',
          cursor: loading ? 'not-allowed' : 'pointer',
          justifySelf: 'start',
        }}
      >
        {loading ? 'Creating...' : 'Create Source'}
      </button>
      {message && <div style={{ fontSize: 13, color: '#6b7280' }}>{message}</div>}
    </form>
  );
}
