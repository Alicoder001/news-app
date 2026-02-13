/**
 * Admin Authentication Utility
 * 
 * Simple secret-based auth for admin panel
 * For production, consider NextAuth.js or Clerk
 * 
 * @author Antigravity Team
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify admin secret against environment variable
 */
export function verifyAdminSecret(secret: string): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  
  if (!adminSecret) {
    console.warn('⚠️ ADMIN_SECRET not configured');
    return false;
  }
  
  return secret === adminSecret;
}

/**
 * Check if current request is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  
  if (!authCookie) return false;
  
  // Verify the stored token
  return verifyAdminSecret(authCookie.value);
}

/**
 * Set authentication cookie after successful login
 */
export async function setAuthCookie(secret: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(ADMIN_COOKIE_NAME, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/admin',
  });
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/admin/login');
  }
}

/**
 * Get admin status info
 */
export function getAdminInfo() {
  return {
    isConfigured: !!process.env.ADMIN_SECRET,
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}

/**
 * API route guard for admin endpoints
 * Returns 401 JSON response when request is not authenticated.
 */
export async function ensureAdminApiAuth(): Promise<NextResponse | null> {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return null;
  }

  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
