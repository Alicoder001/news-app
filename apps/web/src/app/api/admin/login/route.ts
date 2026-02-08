import { NextResponse } from 'next/server';
import { verifyAdminSecret, setAuthCookie, isTrustedOrigin } from '@/lib/admin/auth';
import { checkRateLimit, getClientIP, getRateLimitHeaders } from '@/lib/rate-limit';
import { adminLoginSchema, parseJsonBody } from '@/lib/admin/validation';

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
  }

  const ip = getClientIP(request);
  const rateLimit = await checkRateLimit(`admin-login:${ip}`, { limit: 10, windowSeconds: 300 });
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) }
    );
  }

  try {
    const parsed = await parseJsonBody(request, adminLoginSchema);
    if (parsed.error) return parsed.error;
    const { secret } = parsed.data;

    const isValid = verifyAdminSecret(secret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Noto'g'ri secret" },
        { status: 401 }
      );
    }

    // Set auth cookie
    await setAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
