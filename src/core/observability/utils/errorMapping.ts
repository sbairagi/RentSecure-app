export type BackendErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, any>;
    request_id?: string;
  };
  detail?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
};

export function extractBackendErrorCode(data: any): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  if (data.error?.code) return String(data.error.code);
  if (data.code) return String(data.code);
  return undefined;
}

export function extractBackendErrorMessage(data: any): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  if (data.error?.message) return String(data.error.message);
  if (data.detail) return String(data.detail);
  if (data.message) return String(data.message);
  return undefined;
}

export function extractBackendErrorDetails(data: any): Record<string, any> | undefined {
  if (!data || typeof data !== 'object') return undefined;
  if (data.error?.details && typeof data.error.details === 'object') return data.error.details;
  if (data.errors && typeof data.errors === 'object') return data.errors;
  if (data.detail && typeof data.detail === 'object') return data.detail;
  return undefined;
}

export function extractRequestId(data: any, headers?: Record<string, any>): string | undefined {
  if (headers?.['X-Request-ID']) return headers['X-Request-ID'];
  if (headers?.['X-Correlation-ID']) return headers['X-Correlation-ID'];
  if (headers?.['x-request-id']) return headers['x-request-id'];
  if (headers?.['x-correlation-id']) return headers['x-correlation-id'];
  if (data?.error?.request_id) return String(data.error.request_id);
  if (data?.request_id) return String(data.request_id);
  return undefined;
}

export function hasStandardErrorEnvelope(data: any): boolean {
  return !!data?.error?.message || !!data?.error?.code;
}

export function isDrfDefaultError(data: any): boolean {
  return !!data?.detail;
}
