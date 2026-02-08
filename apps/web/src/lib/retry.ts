export interface RetryOptions {
  attempts: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDelay(
  attempt: number,
  initialDelayMs: number,
  factor: number,
  maxDelayMs: number
): number {
  const delay = Math.round(initialDelayMs * Math.pow(factor, attempt));
  return Math.min(delay, maxDelayMs);
}

/**
 * Retry helper with exponential backoff.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const attempts = Math.max(1, options.attempts);
  const initialDelayMs = options.initialDelayMs ?? 500;
  const maxDelayMs = options.maxDelayMs ?? 5000;
  const factor = options.factor ?? 2;

  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Last attempt, do not delay
      if (attempt >= attempts - 1) {
        break;
      }

      const delay = getDelay(attempt, initialDelayMs, factor, maxDelayMs);
      await sleep(delay);
    }
  }

  throw lastError;
}
