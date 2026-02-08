/**
 * Rate Limiter for API Routes
 *
 * Strategy:
 * - Preferred: Upstash Redis (distributed, multi-instance safe)
 * - Fallback: in-memory (single-instance safe)
 *
 * @author Antigravity Team
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface UpstashPipelineItem {
  result?: unknown;
  error?: string;
}

// In-memory store fallback
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old in-memory entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60_000);

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

function checkRateLimitInMemory(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // First request or expired window
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowSeconds * 1000;
    rateLimitStore.set(identifier, { count: 1, resetTime });

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: resetTime,
    };
  }

  // Existing window
  entry.count += 1;

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

function getRedisConfig(): { url: string; token: string } | null {
  // Redis rate limiting is production-only by policy.
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function parseNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult | null> {
  const redis = getRedisConfig();
  if (!redis) {
    return null;
  }

  const key = `ratelimit:${identifier}`;

  try {
    const response = await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['PTTL', key],
        ['EXPIRE', key, config.windowSeconds, 'NX'],
      ]),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Upstash responded with ${response.status}`);
    }

    const payload = (await response.json()) as UpstashPipelineItem[];
    if (!Array.isArray(payload) || payload.length < 2) {
      throw new Error('Invalid Upstash pipeline payload');
    }

    if (payload.some((item) => item.error)) {
      throw new Error(`Upstash pipeline error: ${payload.map((item) => item.error).filter(Boolean).join(', ')}`);
    }

    const count = parseNumber(payload[0]?.result, 0);
    let ttlMs = parseNumber(payload[1]?.result, 0);

    // PTTL can return -1/-2 in edge cases
    if (ttlMs <= 0) {
      ttlMs = config.windowSeconds * 1000;
    }

    const reset = Date.now() + ttlMs;
    const success = count <= config.limit;

    return {
      success,
      limit: config.limit,
      remaining: success ? Math.max(config.limit - count, 0) : 0,
      reset,
    };
  } catch (error) {
    console.warn('[rate-limit] Redis unavailable, using in-memory fallback:', error);
    return null;
  }
}

/**
 * Check rate limit for a given identifier.
 *
 * Distributed mode (Upstash Redis) is used when:
 * - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured.
 *
 * Otherwise in-memory fallback is used.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const distributedResult = await checkRateLimitRedis(identifier, config);
  if (distributedResult) {
    return distributedResult;
  }

  return checkRateLimitInMemory(identifier, config);
}

/**
 * Get client IP from request headers.
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Create rate limit headers for response.
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}

/**
 * Predefined rate limit configs.
 */
export const RATE_LIMITS = {
  // Strict: 10 requests per minute (for cron/admin endpoints)
  STRICT: { limit: 10, windowSeconds: 60 },

  // Standard: 60 requests per minute (for public API)
  STANDARD: { limit: 60, windowSeconds: 60 },

  // Relaxed: 100 requests per minute (for read-heavy endpoints)
  RELAXED: { limit: 100, windowSeconds: 60 },
} as const;
