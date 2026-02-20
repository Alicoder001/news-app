'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Play } from 'lucide-react';

type TriggerKind = 'sync' | 'process';
type TriggerState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

async function triggerPipeline(path: '/api/news/sync' | '/api/news/process') {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let payload: { message?: string; error?: string } | null = null;
  try {
    payload = (await response.json()) as { message?: string; error?: string };
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      message: payload?.error ?? 'Trigger failed',
    };
  }

  return {
    ok: true,
    message: payload?.message ?? 'Triggered',
  };
}

export function ManualTriggerControls({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<TriggerKind | null>(null);
  const [state, setState] = useState<TriggerState>({
    status: 'idle',
    message: '',
  });

  const handleTrigger = async (kind: TriggerKind) => {
    setLoading(kind);
    setState({
      status: 'idle',
      message: '',
    });

    const target = kind === 'sync' ? '/api/news/sync' : '/api/news/process';
    const result = await triggerPipeline(target);

    setState({
      status: result.ok ? 'success' : 'error',
      message: result.message,
    });
    setLoading(null);
    router.refresh();
  };

  const wrapperClass = compact
    ? 'flex items-center justify-center gap-2'
    : 'flex flex-col items-end gap-2';

  return (
    <div className={wrapperClass}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleTrigger('sync')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading === 'sync' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Sync
        </button>
        <button
          type="button"
          onClick={() => handleTrigger('process')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-foreground/15 text-sm font-medium hover:bg-foreground/[0.04] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading === 'process' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Process
        </button>
      </div>

      {state.status !== 'idle' && state.message && (
        <p
          className={`text-xs ${
            state.status === 'success' ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
