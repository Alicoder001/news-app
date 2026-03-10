import { NextRequest, NextResponse } from 'next/server';

import { getAdminApiAuthHeaders } from '@/lib/admin/auth';
import { requestBackend } from '@/lib/api/backend-client';

// PUT - Update source
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminHeaders = await getAdminApiAuthHeaders();
  if (!adminHeaders) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, url, isActive } = body;

    const backend = await requestBackend<{ success: boolean; data: unknown }>(
      `/v1/admin/sources/${id}`,
      {
        method: 'PUT',
        headers: adminHeaders,
        body: JSON.stringify({ name, type, url, isActive }),
      },
    );

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Server xatosi' },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json(backend.data.data);
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// PATCH - Toggle source active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminHeaders = await getAdminApiAuthHeaders();
  if (!adminHeaders) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const backend = await requestBackend<{ success: boolean; data: unknown }>(
      `/v1/admin/sources/${id}`,
      {
        method: 'PATCH',
        headers: adminHeaders,
      },
    );

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Server xatosi' },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json(backend.data.data);
  } catch (error) {
    console.error('Error toggling source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// DELETE - Delete source
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminHeaders = await getAdminApiAuthHeaders();
  if (!adminHeaders) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const backend = await requestBackend<{ success: boolean; data: unknown }>(
      `/v1/admin/sources/${id}`,
      {
        method: 'DELETE',
        headers: adminHeaders,
      },
    );

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Server xatosi' },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
