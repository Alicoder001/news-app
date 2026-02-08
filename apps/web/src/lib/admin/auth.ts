/**
 * Admin Authentication Utility
 *
 * Signed session-based auth for admin panel.
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getAdminSecret(): string | null {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    console.warn('ADMIN_SECRET not configured');
    return null;
  }
  return adminSecret;
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function createSessionToken(secret: string): string {
  const issuedAt = Date.now().toString();
  const signature = signPayload(issuedAt, secret);
  return `${issuedAt}.${signature}`;
}

function verifySessionToken(token: string, secret: string): boolean {
  const [issuedAtRaw, signature] = token.split('.');
  if (!issuedAtRaw || !signature) return false;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;

  const ageMs = Date.now() - issuedAt;
  if (ageMs < 0 || ageMs > COOKIE_MAX_AGE * 1000) return false;

  const expected = signPayload(issuedAtRaw, secret);
  return safeCompare(signature, expected);
}

/**
 * Verify admin secret against environment variable.
 */
export function verifyAdminSecret(secret: string): boolean {
  const adminSecret = getAdminSecret();
  if (!adminSecret) return false;
  return safeCompare(secret, adminSecret);
}

/**
 * Check if current request is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const adminSecret = getAdminSecret();
  if (!adminSecret) return false;

  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!authCookie) return false;

  return verifySessionToken(authCookie.value, adminSecret);
}

/**
 * Set authentication cookie after successful login.
 */
export async function setAuthCookie(): Promise<void> {
  const adminSecret = getAdminSecret();
  if (!adminSecret) {
    throw new Error('ADMIN_SECRET not configured');
  }

  const token = createSessionToken(adminSecret);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Clear authentication cookie.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

/**
 * Require authentication - redirect to login if not authenticated.
 */
export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }
}

/**
 * Check request origin for CSRF mitigation on mutation endpoints.
 */
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!origin) {
    return process.env.NODE_ENV !== 'production';
  }

  if (!appUrl) {
    return process.env.NODE_ENV !== 'production';
  }

  try {
    return new URL(origin).origin === new URL(appUrl).origin;
  } catch {
    return false;
  }
}

/**
 * Common admin API guard.
 */
export async function requireAdminApiAuth(
  request: Request,
  options: { requireTrustedOrigin?: boolean } = {}
): Promise<NextResponse | null> {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (options.requireTrustedOrigin && !isTrustedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
  }

  return null;
}

/**
 * Get admin status info.
 */
export function getAdminInfo() {
  return {
    isConfigured: !!process.env.ADMIN_SECRET,
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}
