/**
 * Admin authentication/session utilities.
 *
 * Browser login submits admin secret once, then this layer keeps
 * backend-issued access/refresh tokens in httpOnly cookies.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/api/backend-client';

const ADMIN_ACCESS_COOKIE_NAME = 'admin_access_token';
const ADMIN_REFRESH_COOKIE_NAME = 'admin_refresh_token';
const ACCESS_COOKIE_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface AdminTokens {
  accessToken: string;
  refreshToken: string;
}

interface BackendAuthResponse {
  success?: boolean;
  message?: string;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
}

async function parseAuthResponse(response: Response): Promise<BackendAuthResponse | null> {
  try {
    return (await response.json()) as BackendAuthResponse;
  } catch {
    return null;
  }
}

function buildCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  };
}

async function setAuthCookies(tokens: AdminTokens): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_ACCESS_COOKIE_NAME,
    tokens.accessToken,
    buildCookieOptions(ACCESS_COOKIE_MAX_AGE),
  );
  cookieStore.set(
    ADMIN_REFRESH_COOKIE_NAME,
    tokens.refreshToken,
    buildCookieOptions(REFRESH_COOKIE_MAX_AGE),
  );
}

async function refreshSession(refreshToken: string): Promise<string | null> {
  const response = await fetch(`${getBackendBaseUrl()}/v1/admin/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });
  const payload = await parseAuthResponse(response);

  if (!response.ok || !payload?.accessToken || !payload.refreshToken) {
    return null;
  }

  await setAuthCookies({
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });

  return payload.accessToken;
}

/**
 * Authenticate with admin secret via backend and create session cookies.
 */
export async function loginAdmin(secret: string): Promise<{
  success: boolean;
  status: number;
  error?: string;
}> {
  if (!secret) {
    return {
      success: false,
      status: 400,
      error: 'Secret talab qilinadi',
    };
  }

  const response = await fetch(`${getBackendBaseUrl()}/v1/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'superadmin',
      password: secret,
    }),
    cache: 'no-store',
  });
  const payload = await parseAuthResponse(response);

  if (!response.ok || !payload?.accessToken || !payload.refreshToken) {
    return {
      success: false,
      status: response.status || 401,
      error: payload?.message ?? payload?.error ?? "Noto'g'ri secret",
    };
  }

  await setAuthCookies({
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });

  return {
    success: true,
    status: 200,
  };
}

/**
 * Get current admin access token (auto-refreshes when needed).
 */
export async function getAdminAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE_NAME)?.value;
  if (accessToken) {
    return accessToken;
  }

  const refreshToken = cookieStore.get(ADMIN_REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return null;
  }

  const refreshedToken = await refreshSession(refreshToken);
  if (refreshedToken) {
    return refreshedToken;
  }

  await clearAuthCookie();
  return null;
}

/**
 * Check if current request is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAdminAccessToken();
  return !!token;
}

/**
 * Clear admin session cookies.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_ACCESS_COOKIE_NAME);
  cookieStore.delete(ADMIN_REFRESH_COOKIE_NAME);
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
 * Get admin status info.
 */
export function getAdminInfo() {
  return {
    isConfigured: !!process.env.ADMIN_SECRET,
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}

/**
 * API route guard for admin endpoints.
 * Returns 401 JSON response when request is not authenticated.
 */
export async function ensureAdminApiAuth(): Promise<NextResponse | null> {
  const token = await getAdminAccessToken();
  if (token) {
    return null;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * Build admin Authorization header from active session.
 */
export async function getAdminApiAuthHeaders(): Promise<Record<string, string> | null> {
  const token = await getAdminAccessToken();
  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
