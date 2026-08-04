import type { ApiErrorCode, SecureNestApiError } from './types';

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT: 'The request timed out. Please try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'The request could not be completed due to a conflict.',
  VALIDATION_ERROR: 'Please check the information and try again.',
  RATE_LIMITED: 'Too many requests. Please wait and try again.',
  MAINTENANCE: 'The service is temporarily unavailable. Please try again later.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable. Please try again later.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
};

export class ApiError extends Error implements SecureNestApiError {
  public readonly code: ApiErrorCode;
  public readonly statusCode?: number;
  public readonly details?: Record<string, any>;
  public readonly correlationId?: string;

  constructor(error: Partial<SecureNestApiError> & { message: string }) {
    super(error.message);
    this.name = 'ApiError';
    this.code = error.code || 'UNKNOWN';
    this.statusCode = error.statusCode;
    this.details = error.details;
    this.correlationId = error.correlationId;
  }

  getUserMessage(): string {
    return ERROR_MESSAGES[this.code] || ERROR_MESSAGES.UNKNOWN;
  }
}

export function createApiError(error: any, correlationId?: string): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  const axiosError = error as any;
  const status = axiosError?.response?.status;
  const data = axiosError?.response?.data;

  let code: ApiErrorCode = 'UNKNOWN';
  let message = ERROR_MESSAGES.UNKNOWN;
  let details: Record<string, any> | undefined;

  if (axiosError?.code === 'ECONNABORTED' || axiosError?.message?.includes('timeout')) {
    code = 'TIMEOUT';
    message = ERROR_MESSAGES.TIMEOUT;
  } else if (
    !status &&
    (axiosError?.message?.includes('Network') || axiosError?.message?.includes('network'))
  ) {
    code = 'NETWORK_ERROR';
    message = ERROR_MESSAGES.NETWORK_ERROR;
  } else if (status === 401) {
    code = 'UNAUTHORIZED';
    message = data?.message || ERROR_MESSAGES.UNAUTHORIZED;
    details = data?.details;
  } else if (status === 403) {
    code = 'FORBIDDEN';
    message = data?.message || ERROR_MESSAGES.FORBIDDEN;
    details = data?.details;
  } else if (status === 404) {
    code = 'NOT_FOUND';
    message = data?.message || ERROR_MESSAGES.NOT_FOUND;
  } else if (status === 409) {
    code = 'CONFLICT';
    message = data?.message || ERROR_MESSAGES.CONFLICT;
    details = data?.details;
  } else if (status === 422) {
    code = 'VALIDATION_ERROR';
    message = data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    details = data?.errors || data?.details;
  } else if (status === 429) {
    code = 'RATE_LIMITED';
    message = data?.message || ERROR_MESSAGES.RATE_LIMITED;
    details = data?.details;
  } else if (status === 503) {
    code = 'MAINTENANCE';
    message = data?.message || ERROR_MESSAGES.MAINTENANCE;
  } else if (status && status >= 500) {
    code = 'SERVER_ERROR';
    message = data?.message || ERROR_MESSAGES.SERVER_ERROR;
  } else if (axiosError?.message) {
    message = axiosError.message;
  }

  if (data?.message && status !== 401 && status !== 403) {
    message = data.message;
  }

  return new ApiError({
    message,
    code,
    statusCode: status,
    details,
    correlationId,
  });
}

export function getErrorCode(error: any): ApiErrorCode {
  if (error instanceof ApiError) {
    return error.code;
  }

  const axiosError = error as any;
  const status = axiosError?.response?.status;

  if (axiosError?.code === 'ECONNABORTED' || axiosError?.message?.includes('timeout')) {
    return 'TIMEOUT';
  }
  if (
    !status &&
    (axiosError?.message?.includes('Network') || axiosError?.message?.includes('network'))
  ) {
    return 'NETWORK_ERROR';
  }
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status === 429) return 'RATE_LIMITED';
  if (status === 503) return 'MAINTENANCE';
  if (status && status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN';
}

export function isRetryableError(error: any): boolean {
  const code = getErrorCode(error);
  return [
    'NETWORK_ERROR',
    'TIMEOUT',
    'SERVER_ERROR',
    'SERVICE_UNAVAILABLE',
    'RATE_LIMITED',
  ].includes(code);
}
