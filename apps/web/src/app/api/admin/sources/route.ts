import { NextRequest, NextResponse } from 'next/server';

import { ensureAdminApiAuth } from '@/lib/admin/auth';
import { getInternalBridgeHeaders, requestBackend } from '@/lib/api/backend-client';

// POST - Create new source
export async function POST(request: NextRequest) {
  const unauthorized = await ensureAdminApiAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { name, type, url, isActive } = body;

    const backend = await requestBackend<{ success: boolean; data: unknown }>(
      '/v1/admin/sources',
      {
        method: 'POST',
        headers: getInternalBridgeHeaders(),
        body: JSON.stringify({
          name,
          type: type || 'RSS',
          url,
          isActive: isActive ?? true,
        }),
      },
    );

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Server xatosi' },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json(backend.data.data, { status: 201 });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
