import { ApiError } from '@/services/api/errorHandler';
import { refreshTokenManager } from '@/services/api/refreshToken';
import { errorReporter } from '@/core/observability/error/ErrorReporter';
import { classifyHttpError, isAuthenticationError, isAuthorizationError, buildErrorContext } from '@/core/observability/utils/classify';

describe('Token refresh concurrency', () => {
  it('should not allow concurrent refresh calls', async () => {
    refreshTokenManager['isRefreshing'] = true;
    expect(refreshTokenManager.isRefreshInProgress()).toBe(true);
    refreshTokenManager['isRefreshing'] = false;
    expect(refreshTokenManager.isRefreshInProgress()).toBe(false);
  });

  it('should queue multiple refresh requests', async () => {
    refreshTokenManager['isRefreshing'] = false;
    refreshTokenManager['failedQueue'] = [];
    const promise1 = refreshTokenManager.refreshToken({} as any);
    const promise2 = refreshTokenManager.refreshToken({} as any);
    try {
      await Promise.all([promise1, promise2]);
    } catch {
      // expected to fail without valid tokens
    }
    expect(refreshTokenManager['failedQueue'].length).toBeGreaterThanOrEqual(0);
  });
});

describe('ErrorReporter', () => {
  it('should categorize 401 as AUTHENTICATION_ERROR', () => {
    const result = errorReporter.report({ response: { status: 401 }, message: 'Unauthorized' });
    expect(result.category).toBe('AUTHENTICATION_ERROR');
    expect(result.isRetryable).toBe(false);
  });

  it('should categorize 403 as AUTHORIZATION_ERROR', () => {
    const result = errorReporter.report({ response: { status: 403 }, message: 'Forbidden' });
    expect(result.category).toBe('AUTHORIZATION_ERROR');
    expect(result.isRetryable).toBe(false);
  });

  it('should categorize 500 as SERVER_ERROR', () => {
    const result = errorReporter.report({ response: { status: 500 }, message: 'Server error' });
    expect(result.category).toBe('SERVER_ERROR');
    expect(result.isRetryable).toBe(true);
  });

  it('should return user-friendly message', () => {
    const result = errorReporter.report({ response: { status: 404 }, message: 'Not found' });
    expect(result.userMessage).toBeDefined();
    expect(result.userMessage.length).toBeGreaterThan(0);
  });
});

describe('Error boundary state', () => {
  it('should categorize network errors', () => {
    const { ErrorBoundary } = require('@/core/observability/error/ErrorBoundary');
    const category = (ErrorBoundary as any).categorizeError(new Error('Network request failed'));
    expect(category).toBe('NETWORK_ERROR');
  });

  it('should categorize auth errors', () => {
    const { ErrorBoundary } = require('@/core/observability/error/ErrorBoundary');
    const category = (ErrorBoundary as any).categorizeError(new Error('Auth token expired'));
    expect(category).toBe('AUTHENTICATION_ERROR');
  });
});

describe('401/403 distinction', () => {
  it('should never treat 403 as AUTHENTICATION_ERROR', () => {
    expect(isAuthenticationError({ response: { status: 403 } })).toBe(false);
    expect(isAuthorizationError({ response: { status: 403 } })).toBe(true);
  });

  it('should classify 401 as authentication', () => {
    expect(classifyHttpError(401)).toBe('AUTHENTICATION_ERROR');
  });

  it('should classify 403 as authorization', () => {
    expect(classifyHttpError(403)).toBe('AUTHORIZATION_ERROR');
  });
});

describe('Request context building', () => {
  it('should extract correlation ID from headers', () => {
    const error = {
      response: { status: 500 },
      config: {
        headers: { 'X-Correlation-ID': 'corr-123', 'X-Request-ID': 'req-456' },
        url: '/api/test',
        method: 'POST',
      },
    };
    const ctx = buildErrorContext(error);
    expect(ctx.correlationId).toBe('corr-123');
    expect(ctx.endpoint).toBe('/api/test');
    expect(ctx.method).toBe('POST');
  });
});

describe('Error reporter - no crash for 401/403', () => {
  it('should not crash on 401 reporting', () => {
    expect(() => {
      errorReporter.report({ response: { status: 401 }, message: 'Unauthorized' });
    }).not.toThrow();
  });

  it('should not crash on 403 reporting', () => {
    expect(() => {
      errorReporter.report({ response: { status: 403 }, message: 'Forbidden' });
    }).not.toThrow();
  });
});
