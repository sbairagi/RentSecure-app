export type RetryStrategy = 'linear' | 'exponential' | 'fixed';

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  strategy: RetryStrategy;
  maxDelay: number;
  retryableStatusCodes: number[];
  retryableErrors: string[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  strategy: 'exponential',
  maxDelay: 10000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrors: [
    'ECONNABORTED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'ECONNRESET',
    'Network request failed',
  ],
};

export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  if (config.strategy === 'fixed') {
    return config.retryDelay;
  }

  if (config.strategy === 'linear') {
    return config.retryDelay * (attempt + 1);
  }

  const exponentialDelay = config.retryDelay * Math.pow(2, attempt);
  return Math.min(exponentialDelay, config.maxDelay);
}

export function isRetryableStatus(
  status: number | undefined,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
  if (!status) return false;
  return config.retryableStatusCodes.includes(status);
}

export function isRetryableError(error: any, config: RetryConfig = DEFAULT_RETRY_CONFIG): boolean {
  if (!error) return false;

  const errorMessage = error.message || error.code || '';
  return config.retryableErrors.some((retryableError) =>
    errorMessage.toLowerCase().includes(retryableError.toLowerCase())
  );
}

export function shouldRetry(
  error: any,
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): boolean {
  if (attempt >= config.maxRetries) return false;
  if (isRetryableStatus(error?.response?.status, config)) return true;
  if (isRetryableError(error, config)) return true;
  return false;
}
