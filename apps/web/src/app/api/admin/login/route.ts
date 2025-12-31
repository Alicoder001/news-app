import { NextResponse } from 'next/server';
import { verifyAdminSecret, setAuthCookie } from '@/lib/admin/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret } = body;

    if (!secret) {
      return NextResponse.json(
        { error: 'Secret talab qilinadi' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminSecret(secret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Noto'g'ri secret" },
        { status: 401 }
      );
    }

    // Set auth cookie
    await setAuthCookie(secret);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
