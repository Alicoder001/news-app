import { NextResponse } from 'next/server';
import { clearAuthCookie, getAdminApiAuthHeaders } from '@/lib/admin/auth';
import { requestBackend } from '@/lib/api/backend-client';

export async function POST() {
  const adminHeaders = await getAdminApiAuthHeaders();

  if (adminHeaders) {
    try {
      await requestBackend('/v1/admin/auth/logout', {
        method: 'POST',
        headers: adminHeaders,
      });
    } catch {
      // Session cleanup below is still authoritative for web side.
    }
  }

  await clearAuthCookie();

  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
