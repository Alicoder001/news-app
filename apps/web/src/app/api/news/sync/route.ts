import { NextResponse } from 'next/server';

import { getAdminApiAuthHeaders } from '@/lib/admin/auth';
import { requestBackend } from '@/lib/api/backend-client';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST to trigger sync job',
    mode: 'backend-internal-job',
  });
}

export async function POST() {
  const adminHeaders = await getAdminApiAuthHeaders();
  if (!adminHeaders) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backend = await requestBackend<{
      accepted: boolean;
      queued: boolean;
      mode: 'queue' | 'dry-run';
      job: string;
      jobId?: string;
    }>('/v1/admin/pipeline/trigger', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        job: 'sync-news',
      }),
    });

    if (!backend.ok || !backend.data?.accepted) {
      return NextResponse.json(
        { success: false, error: 'Failed to trigger sync job' },
        { status: backend.status || 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: backend.data.mode === 'queue' ? 'Sync job queued' : 'Sync dry-run accepted',
      ...backend.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 },
    );
  }
}
