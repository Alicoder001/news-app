interface BackendRequestInit extends RequestInit {
  query?: Record<string, string | number | undefined>;
}

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, POST, PUT, PATCH, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const;

export function getBackendBaseUrl(): string {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:4000'
  );
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function requestBackend<T>(
  path: string,
  options: BackendRequestInit = {},
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const baseUrl = getBackendBaseUrl();
  const query = options.query ? buildQuery(options.query) : '';
  const response = await fetch(`${baseUrl}${path}${query}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body,
    cache: 'no-store',
  });

  let payload: T | null = null;
  try {
    payload = (await response.json()) as T;
  } catch {
    payload = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    data: payload,
  };
}

export function getInternalBridgeHeaders(): Record<string, string> {
  const token = process.env.API_INTERNAL_TOKEN;
  if (!token) {
    return {};
  }

  return {
    'x-internal-token': token,
  };
}
