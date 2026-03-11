import { DomainError } from '@/lib/errors/domain';
import { log } from '@/lib/logging/logger';

export function ok<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400, code?: string) {
  return Response.json({ success: false, error: message, code }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof DomainError) {
    return fail(error.message, error.status, error.code);
  }

  const message = error instanceof Error ? error.message : 'Internal server error';
  log({
    level: 'ERROR',
    message: 'Unhandled route error',
    context: { error: message },
  });

  return fail(message, 500, 'INTERNAL_ERROR');
}

export async function withRouteHandler<T>(handler: () => Promise<Response | T> | Response | T) {
  try {
    const result = await handler();
    return result instanceof Response ? result : ok(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
