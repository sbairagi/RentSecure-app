import { createApiError } from '@/services/api/errorHandler';
import { classifyHttpError, isRetryable } from '@/core/observability/utils/classify';

describe('createApiError - 401 handling', () => {
  it('should create UNAUTHORIZED error for 401', () => {
    const error = createApiError({
      response: { status: 401, data: { message: 'Token expired' } },
      message: 'Request failed',
    });
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.statusCode).toBe(401);
  });

  it('should not expose backend details for 401', () => {
    const error = createApiError({
      response: { status: 401, data: { detail: 'Authentication credentials were not provided.' } },
    });
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.message).not.toContain('credentials');
  });
});

describe('createApiError - 403 handling', () => {
  it('should create FORBIDDEN error for 403', () => {
    const error = createApiError({
      response: { status: 403, data: { message: 'Permission denied' } },
      message: 'Request failed',
    });
    expect(error.code).toBe('FORBIDDEN');
    expect(error.statusCode).toBe(403);
  });
});

describe('createApiError - 422 validation', () => {
  it('should create VALIDATION_ERROR for 422', () => {
    const error = createApiError({
      response: {
        status: 422,
        data: {
          errors: { email: ['This field is required.'], phone: ['Enter a valid phone number.'] },
        },
      },
    });
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toEqual({
      email: ['This field is required.'],
      phone: ['Enter a valid phone number.'],
    });
  });
});

describe('createApiError - 429 rate limit', () => {
  it('should create RATE_LIMITED error for 429', () => {
    const error = createApiError({
      response: { status: 429, data: { message: 'Too many requests' } },
    });
    expect(error.code).toBe('RATE_LIMITED');
    expect(error.statusCode).toBe(429);
  });
});

describe('createApiError - 500+ errors', () => {
  it('should create SERVER_ERROR for 500', () => {
    const error = createApiError({
      response: { status: 500, data: { message: 'Database error' } },
    });
    expect(error.code).toBe('SERVER_ERROR');
    expect(error.statusCode).toBe(500);
  });

  it('should create SERVER_ERROR for 502', () => {
    const error = createApiError({
      response: { status: 502, data: { message: 'Bad gateway' } },
    });
    expect(error.code).toBe('SERVER_ERROR');
  });

  it('should create SERVER_ERROR for 504', () => {
    const error = createApiError({
      response: { status: 504, data: { message: 'Gateway timeout' } },
    });
    expect(error.code).toBe('SERVER_ERROR');
  });
});

describe('createApiError - network errors', () => {
  it('should create NETWORK_ERROR for network failure', () => {
    const error = createApiError({
      message: 'Network request failed',
    });
    expect(error.code).toBe('NETWORK_ERROR');
  });

  it('should create TIMEOUT for timeout', () => {
    const error = createApiError({
      code: 'ECONNABORTED',
      message: 'timeout',
    });
    expect(error.code).toBe('TIMEOUT');
  });
});

describe('createApiError - retryable', () => {
  it('should mark 429 as retryable', () => {
    expect(isRetryable({ response: { status: 429 } })).toBe(true);
  });

  it('should mark 500 as retryable', () => {
    expect(isRetryable({ response: { status: 500 } })).toBe(true);
  });

  it('should mark 502 as retryable', () => {
    expect(isRetryable({ response: { status: 502 } })).toBe(true);
  });

  it('should mark 504 as retryable', () => {
    expect(isRetryable({ response: { status: 504 } })).toBe(true);
  });

  it('should NOT mark 401 as retryable', () => {
    expect(isRetryable({ response: { status: 401 } })).toBe(false);
  });

  it('should NOT mark 403 as retryable', () => {
    expect(isRetryable({ response: { status: 403 } })).toBe(false);
  });
});
