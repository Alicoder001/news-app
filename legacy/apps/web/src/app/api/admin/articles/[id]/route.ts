import { NextRequest, NextResponse } from 'next/server';

import { getAdminApiAuthHeaders } from '@/lib/admin/auth';
import { requestBackend } from '@/lib/api/backend-client';

// GET - Single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminHeaders = await getAdminApiAuthHeaders();
  if (!adminHeaders) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const backend = await requestBackend<{ success: boolean; data: { article: unknown } }>(
      `/v1/admin/articles/${id}`,
      {
        headers: adminHeaders,
      },
    );

    if (backend.status === 404) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Server xatosi' },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json(backend.data.data.article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// PUT - Update article
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

    const backend = await requestBackend<{
      success: boolean;
      data?: unknown;
      error?: { code?: string };
    }>(`/v1/admin/articles/${id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify(body),
    });

    if (backend.status === 404) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    if (backend.data?.error?.code === 'SLUG_ALREADY_EXISTS') {
      return NextResponse.json({ error: 'Bu slug allaqachon mavjud' }, { status: 400 });
    }

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Server xatosi' },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json(backend.data.data);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

// DELETE - Delete article
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

    const backend = await requestBackend<{ success: boolean }>(`/v1/admin/articles/${id}`, {
      method: 'DELETE',
      headers: adminHeaders,
    });

    if (backend.status === 404) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: 'Server xatosi' },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json({ success: true, message: "Maqola o'chirildi" });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}
