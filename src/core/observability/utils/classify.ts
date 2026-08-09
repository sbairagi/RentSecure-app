import type { ErrorCategory, ErrorContext } from '../types';
import { ERROR_CATEGORIES, HTTP_STATUS_TO_CATEGORY, RETRYABLE_ERROR_CODES, RETRYABLE_STATUS_CODES } from '../constants/errors';

export function classifyHttpError(statusCode: number | undefined): ErrorCategory {
  if (!statusCode) return 'UNKNOWN_ERROR';
  if (HTTP_STATUS_TO_CATEGORY[statusCode]) return HTTP_STATUS_TO_CATEGORY[statusCode];
  if (statusCode >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN_ERROR';
}

export function classifyNetworkError(error: any): ErrorCategory {
  if (!error) return 'UNKNOWN_ERROR';
  const errorCode = error.code;
  const message = (error.message || '').toLowerCase();
  if (errorCode === 'ECONNABORTED' || message.includes('timeout')) return 'TIMEOUT';
  if (errorCode === 'ECONNREFUSED' || message.includes('failed to fetch')) return 'NETWORK_ERROR';
  if (RETRYABLE_ERROR_CODES.includes(errorCode)) return 'NETWORK_ERROR';
  if (message.includes('network') || message.includes('internet')) return 'OFFLINE';
  return 'UNKNOWN_ERROR';
}

export function isRetryable(error: any): boolean {
  if (!error) return false;
  const statusCode = error.response?.status || error.statusCode;
  if (statusCode && RETRYABLE_STATUS_CODES.includes(statusCode)) return true;
  const errorCode = error.code;
  if (errorCode && RETRYABLE_ERROR_CODES.includes(errorCode)) return true;
  const message = (error.message || '').toLowerCase();
  if (message.includes('network request failed')) return true;
  if (message.includes('timeout')) return true;
  return false;
}

export function getErrorSeverity(category: ErrorCategory): 'low' | 'medium' | 'high' | 'critical' {
  return ERROR_CATEGORIES[category]?.severity || 'medium';
}

export function isAuthenticationError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  return statusCode === 401;
}

export function isAuthorizationError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  return statusCode === 403;
}

export function isValidationError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  return statusCode === 422 || statusCode === 400;
}

export function isRateLimitError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  return statusCode === 429;
}

export function isServerError(error: any): boolean {
  const statusCode = error?.response?.status || error?.statusCode;
  return statusCode !== undefined && statusCode >= 500;
}

export function buildErrorContext(error: any, partial?: Partial<ErrorContext>): ErrorContext {
  const statusCode = error?.response?.status || error?.statusCode;
  const config = error?.config || {};
  return {
    correlationId: partial?.correlationId || config.headers?.['X-Correlation-ID'] || config.headers?.['x-correlation-id'],
    requestId: partial?.requestId || config.metadata?.requestId,
    endpoint: partial?.endpoint || config.url,
    method: partial?.method || config.method,
    statusCode: partial?.statusCode || statusCode,
    ...partial,
  };
}
