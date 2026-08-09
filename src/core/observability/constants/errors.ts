import type { ErrorCategory, ErrorSeverity } from '../types';

export const ERROR_CATEGORIES: Record<ErrorCategory, { severity: ErrorSeverity; retryable: boolean }> = {
  NETWORK_ERROR: { severity: 'high', retryable: true },
  AUTHENTICATION_ERROR: { severity: 'high', retryable: false },
  AUTHORIZATION_ERROR: { severity: 'medium', retryable: false },
  VALIDATION_ERROR: { severity: 'low', retryable: false },
  NOT_FOUND: { severity: 'low', retryable: false },
  CONFLICT: { severity: 'medium', retryable: false },
  RATE_LIMIT: { severity: 'medium', retryable: true },
  SERVER_ERROR: { severity: 'high', retryable: true },
  TIMEOUT: { severity: 'high', retryable: true },
  OFFLINE: { severity: 'high', retryable: true },
  PAYMENT_ERROR: { severity: 'high', retryable: false },
  UPLOAD_ERROR: { severity: 'medium', retryable: true },
  SUBSCRIPTION_ERROR: { severity: 'high', retryable: false },
  UNKNOWN_ERROR: { severity: 'medium', retryable: false },
};

export const ERROR_USER_MESSAGES: Record<ErrorCategory, string> = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  AUTHENTICATION_ERROR: 'Your session has expired. Please log in again.',
  AUTHORIZATION_ERROR: 'You do not have permission to access this resource.',
  VALIDATION_ERROR: 'Please check the information and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'The request could not be completed due to a conflict.',
  RATE_LIMIT: 'Too many requests. Please wait and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  TIMEOUT: 'The request timed out. Please try again.',
  OFFLINE: 'You appear to be offline. Please check your connection.',
  PAYMENT_ERROR: 'Payment could not be processed. Please try again or use a different payment method.',
  UPLOAD_ERROR: 'Upload failed. Please check your connection and try again.',
  SUBSCRIPTION_ERROR: 'Subscription operation failed. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

export const HTTP_STATUS_TO_CATEGORY: Record<number, ErrorCategory> = {
  400: 'VALIDATION_ERROR',
  401: 'AUTHENTICATION_ERROR',
  403: 'AUTHORIZATION_ERROR',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMIT',
  500: 'SERVER_ERROR',
  502: 'SERVER_ERROR',
  503: 'SERVER_ERROR',
  504: 'SERVER_ERROR',
};

export const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

export const RETRYABLE_ERROR_CODES = [
  'ECONNABORTED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'ECONNREFUSED',
  'ECONNRESET',
  'Network request failed',
];

export const SLOW_REQUEST_THRESHOLD_MS = 5000;
export const VERY_SLOW_REQUEST_THRESHOLD_MS = 15000;
export const SLOW_UPLOAD_THRESHOLD_MS = 30000;
export const SLOW_DOWNLOAD_THRESHOLD_MS = 30000;
