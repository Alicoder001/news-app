const DEFAULT_ALLOWED_HEADERS = 'Content-Type, Authorization';

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(): string[] {
  const origins = new Set<string>();

  const appUrlOrigin = process.env.NEXT_PUBLIC_APP_URL
    ? normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL)
    : null;
  if (appUrlOrigin) {
    origins.add(appUrlOrigin);
  }

  const customOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') ?? [];
  for (const candidate of customOrigins) {
    const normalized = normalizeOrigin(candidate.trim());
    if (normalized) {
      origins.add(normalized);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }

  return [...origins];
}

function resolveAllowedOrigin(request: Request): string {
  const allowedOrigins = getAllowedOrigins();
  const requestOrigin = request.headers.get('origin');

  if (requestOrigin) {
    const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
    if (normalizedRequestOrigin && allowedOrigins.includes(normalizedRequestOrigin)) {
      return normalizedRequestOrigin;
    }
    return 'null';
  }

  return allowedOrigins[0] ?? 'null';
}

export function getCorsHeaders(
  request: Request,
  methods: string = 'GET, OPTIONS'
): HeadersInit {
  return {
    'Access-Control-Allow-Origin': resolveAllowedOrigin(request),
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': DEFAULT_ALLOWED_HEADERS,
    Vary: 'Origin',
  };
}
