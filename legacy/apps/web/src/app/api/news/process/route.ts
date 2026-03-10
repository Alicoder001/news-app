import { NextResponse } from 'next/server';

import { getAdminApiAuthHeaders } from '@/lib/admin/auth';
import { requestBackend } from '@/lib/api/backend-client';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Use POST to trigger processing job',
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
        job: 'process-raw',
      }),
    });

    if (!backend.ok || !backend.data?.accepted) {
      return NextResponse.json(
        { success: false, error: 'Failed to trigger processing job' },
        { status: backend.status || 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        backend.data.mode === 'queue' ? 'Processing job queued' : 'Processing dry-run accepted',
      ...backend.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Pipeline failed',
      },
      { status: 500 },
    );
  }
}
