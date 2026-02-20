import { NextRequest, NextResponse } from 'next/server';

import { getAdminApiAuthHeaders } from '@/lib/admin/auth';
import { requestBackend } from '@/lib/api/backend-client';

// POST - Send article to Telegram
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminHeaders = await getAdminApiAuthHeaders();
  if (!adminHeaders) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const backend = await requestBackend<{ success: boolean }>(
      `/v1/admin/articles/${id}/telegram`,
      {
        method: 'POST',
        headers: adminHeaders,
      },
    );

    if (backend.status === 404) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 });
    }

    if (!backend.ok || !backend.data?.success) {
      return NextResponse.json(
        { error: "Telegram'ga yuborishda xatolik" },
        { status: backend.status || 500 },
      );
    }

    return NextResponse.json({ success: true, message: 'Telegram kanalga yuborildi' });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return NextResponse.json({ error: "Telegram'ga yuborishda xatolik" }, { status: 500 });
  }
}
