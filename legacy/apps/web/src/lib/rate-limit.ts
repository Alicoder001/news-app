/**
 * Simple Rate Limiter for API Routes
 * 
 * Uses in-memory storage (suitable for single-instance deployments)
 * For production with multiple instances, use Redis-based solution
 * 
 * @author Antigravity Team
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier
 * 
 * @param identifier - Unique identifier (IP, user ID, API key)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 * 
 * @example
 * const result = checkRateLimit(ip, { limit: 10, windowSeconds: 60 });
 * if (!result.success) {
 *   return new Response('Too Many Requests', { status: 429 });
 * }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  // First request or window expired
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowSeconds * 1000;
    rateLimitStore.set(key, { count: 1, resetTime });
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: resetTime,
    };
  }

  // Within window
  entry.count++;
  
  if (entry.count > config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Vercel/Cloudflare headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback
  return 'unknown';
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * Predefined rate limit configs
 */
export const RATE_LIMITS = {
  // Strict: 10 requests per minute (for cron/admin endpoints)
  STRICT: { limit: 10, windowSeconds: 60 },
  
  // Standard: 60 requests per minute (for public API)
  STANDARD: { limit: 60, windowSeconds: 60 },
  
  // Relaxed: 100 requests per minute (for read-heavy endpoints)
  RELAXED: { limit: 100, windowSeconds: 60 },
} as const;
