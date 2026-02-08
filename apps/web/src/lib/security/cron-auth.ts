import { timingSafeEqual } from 'crypto';

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseBearerToken(headerValue: string | null): string | null {
  if (!headerValue) return null;

  const [scheme, token, ...rest] = headerValue.trim().split(/\s+/);
  if (rest.length > 0) return null;
  if (scheme?.toLowerCase() !== 'bearer') return null;
  if (!token) return null;

  return token;
}

/**
 * Verify cron trigger authorization.
 *
 * Accepted sources:
 * - Vercel cron infrastructure header (`x-vercel-cron: 1`)
 * - Bearer token that matches `CRON_SECRET`
 * - All requests in development mode
 */
export function verifyCronSecret(request: Request): boolean {
  if (request.headers.get('x-vercel-cron') === '1') {
    return true;
  }

  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return false;
  }

  const token = parseBearerToken(request.headers.get('authorization'));
  if (!token) {
    return false;
  }

  return safeCompare(token, cronSecret);
}
