import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/admin/auth';

export async function POST() {
  await clearAuthCookie();
  
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
