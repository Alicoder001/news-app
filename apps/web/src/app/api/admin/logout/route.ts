import { NextResponse } from 'next/server';
import { clearAuthCookie, requireAdminApiAuth } from '@/lib/admin/auth';

export async function POST(request: Request) {
  const authError = await requireAdminApiAuth(request, { requireTrustedOrigin: true });
  if (authError) return authError;

  await clearAuthCookie();
  
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
