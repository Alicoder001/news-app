import { NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/admin/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret } = body;

    const result = await loginAdmin(secret);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? 'Kirish muvaffaqiyatsiz' },
        { status: result.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
