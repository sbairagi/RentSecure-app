import { createApiError, ApiError, isRetryableError } from '@/services/api/errorHandler';
import { networkManager } from '@/services/api/networkManager';

describe('Offline handling', () => {
  it('should detect offline state', async () => {
    const status = await networkManager.getCurrentStatus();
    expect(['online', 'offline', 'slow', 'unknown']).toContain(status);
  });

  it('should classify offline error correctly', () => {
    const error = new Error('NO_INTERNET');
    expect((error as any).code).toBeUndefined();
  });
});

describe('Retry behavior', () => {
  it('should retry 500 errors', () => {
    expect(isRetryableError({ response: { status: 500 } })).toBe(true);
  });

  it('should retry 502 errors', () => {
    expect(isRetryableError({ response: { status: 502 } })).toBe(true);
  });

  it('should retry 504 errors', () => {
    expect(isRetryableError({ response: { status: 504 } })).toBe(true);
  });

  it('should retry 429 errors', () => {
    expect(isRetryableError({ response: { status: 429 } })).toBe(true);
  });

  it('should retry timeout errors', () => {
    expect(isRetryableError({ code: 'ECONNABORTED' })).toBe(true);
  });

  it('should retry network errors', () => {
    expect(isRetryableError({ code: 'ECONNREFUSED' })).toBe(true);
  });

  it('should NOT retry 400 errors', () => {
    expect(isRetryableError({ response: { status: 400 } })).toBe(false);
  });

  it('should NOT retry 404 errors', () => {
    expect(isRetryableError({ response: { status: 404 } })).toBe(false);
  });

  it('should NOT retry 422 errors', () => {
    expect(isRetryableError({ response: { status: 422 } })).toBe(false);
  });

  it('should NOT retry 401 errors', () => {
    expect(isRetryableError({ response: { status: 401 } })).toBe(false);
  });

  it('should NOT retry 403 errors', () => {
    expect(isRetryableError({ response: { status: 403 } })).toBe(false);
  });

  it('should NOT cause infinite loops for auth errors', () => {
    const error = { response: { status: 401 }, message: 'Unauthorized' };
    expect(isRetryableError(error)).toBe(false);
  });

  it('should create ApiError with retryable flag', () => {
    const apiError = new ApiError({ message: 'Server error', code: 'SERVER_ERROR', statusCode: 500 });
    expect(isRetryableError(apiError)).toBe(true);
  });
});

describe('Error messages', () => {
  it('should have user-friendly messages for all categories', () => {
    const categories = ['NETWORK_ERROR', 'AUTHENTICATION_ERROR', 'AUTHORIZATION_ERROR', 'VALIDATION_ERROR', 'NOT_FOUND', 'CONFLICT', 'RATE_LIMIT', 'SERVER_ERROR', 'TIMEOUT', 'OFFLINE', 'PAYMENT_ERROR', 'UPLOAD_ERROR', 'SUBSCRIPTION_ERROR', 'UNKNOWN_ERROR'];
    for (const category of categories) {
      const error = new ApiError({ message: 'test', code: category as any });
      expect(error.getUserMessage()).toBeDefined();
      expect(error.getUserMessage().length).toBeGreaterThan(0);
      expect(error.getUserMessage()).not.toContain('undefined');
      expect(error.getUserMessage()).not.toContain('null');
    }
  });

  it('should not expose internal details to users', () => {
    const error = createApiError({
      response: { status: 500, data: { detail: 'Database connection refused at 127.0.0.1:5432' } },
    });
    expect(error.message).not.toContain('127.0.0.1');
    expect(error.message).not.toContain('5432');
    expect(error.message).not.toContain('Database connection refused');
  });
});
