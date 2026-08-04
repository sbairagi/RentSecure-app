export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestConfig = {
  url: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  signal?: AbortSignal;
};

export type QueuedRequest = RequestConfig & {
  id: string;
  createdAt: number;
  retryCount: number;
};

export type NetworkStatus = 'online' | 'offline' | 'slow' | 'unknown';

export type UploadProgress = {
  loaded: number;
  total: number;
  progress: number;
};

export type DownloadProgress = {
  loaded: number;
  total: number;
  progress: number;
};

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'MAINTENANCE'
  | 'SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

export interface SecureNestApiError {
  message: string;
  code: ApiErrorCode;
  statusCode?: number;
  details?: Record<string, any>;
  correlationId?: string;
}

export type RequestMetadata = {
  correlationId: string;
  deviceId: string;
  appVersion: string;
  platform: string;
  language: string;
  timezone: string;
};

export type RetryOptions = {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
  retryableStatuses: number[];
};

export type CacheEntry<T> = {
  data: T;
  timestamp: number;
  staleTime: number;
  cacheTime: number;
};
