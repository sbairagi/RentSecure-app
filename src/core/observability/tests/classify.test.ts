import { classifyHttpError, classifyNetworkError, isRetryable, getErrorSeverity, buildErrorContext, isAuthenticationError, isAuthorizationError, isValidationError, isRateLimitError, isServerError } from '@/core/observability/utils/classify';
import { ERROR_CATEGORIES } from '@/core/observability/constants/errors';

describe('classifyHttpError', () => {
  it('should classify 401 as AUTHENTICATION_ERROR', () => {
    expect(classifyHttpError(401)).toBe('AUTHENTICATION_ERROR');
  });

  it('should classify 403 as AUTHORIZATION_ERROR', () => {
    expect(classifyHttpError(403)).toBe('AUTHORIZATION_ERROR');
  });

  it('should classify 404 as NOT_FOUND', () => {
    expect(classifyHttpError(404)).toBe('NOT_FOUND');
  });

  it('should classify 422 as VALIDATION_ERROR', () => {
    expect(classifyHttpError(422)).toBe('VALIDATION_ERROR');
  });

  it('should classify 429 as RATE_LIMIT', () => {
    expect(classifyHttpError(429)).toBe('RATE_LIMIT');
  });

  it('should classify 500 as SERVER_ERROR', () => {
    expect(classifyHttpError(500)).toBe('SERVER_ERROR');
  });

  it('should classify 502 as SERVER_ERROR', () => {
    expect(classifyHttpError(502)).toBe('SERVER_ERROR');
  });

  it('should classify 504 as SERVER_ERROR', () => {
    expect(classifyHttpError(504)).toBe('SERVER_ERROR');
  });

  it('should classify 503 as SERVER_ERROR', () => {
    expect(classifyHttpError(503)).toBe('SERVER_ERROR');
  });

  it('should classify 400 as VALIDATION_ERROR', () => {
    expect(classifyHttpError(400)).toBe('VALIDATION_ERROR');
  });

  it('should classify 409 as CONFLICT', () => {
    expect(classifyHttpError(409)).toBe('CONFLICT');
  });

  it('should classify undefined as UNKNOWN_ERROR', () => {
    expect(classifyHttpError(undefined)).toBe('UNKNOWN_ERROR');
  });

  it('should classify 418 as UNKNOWN_ERROR', () => {
    expect(classifyHttpError(418)).toBe('UNKNOWN_ERROR');
  });
});

describe('classifyNetworkError', () => {
  it('should classify ECONNABORTED as TIMEOUT', () => {
    expect(classifyNetworkError({ code: 'ECONNABORTED', message: 'timeout' })).toBe('TIMEOUT');
  });

  it('should classify ETIMEDOUT as TIMEOUT', () => {
    expect(classifyNetworkError({ code: 'ETIMEDOUT' })).toBe('TIMEOUT');
  });

  it('should classify ECONNREFUSED as NETWORK_ERROR', () => {
    expect(classifyNetworkError({ code: 'ECONNREFUSED', message: 'failed to fetch' })).toBe('NETWORK_ERROR');
  });

  it('should classify network message as OFFLINE', () => {
    expect(classifyNetworkError({ message: 'no internet connection' })).toBe('OFFLINE');
  });

  it('should classify unknown as UNKNOWN_ERROR', () => {
    expect(classifyNetworkError(null)).toBe('UNKNOWN_ERROR');
  });
});

describe('isRetryable', () => {
  it('should return true for 500', () => {
    expect(isRetryable({ response: { status: 500 } })).toBe(true);
  });

  it('should return true for ECONNABORTED', () => {
    expect(isRetryable({ code: 'ECONNABORTED' })).toBe(true);
  });

  it('should return false for 401', () => {
    expect(isRetryable({ response: { status: 401 } })).toBe(false);
  });

  it('should return false for 403', () => {
    expect(isRetryable({ response: { status: 403 } })).toBe(false);
  });
});

describe('getErrorSeverity', () => {
  it('should return high for SERVER_ERROR', () => {
    expect(getErrorSeverity('SERVER_ERROR')).toBe('high');
  });

  it('should return low for VALIDATION_ERROR', () => {
    expect(getErrorSeverity('VALIDATION_ERROR')).toBe('low');
  });

  it('should return medium for RATE_LIMIT', () => {
    expect(getErrorSeverity('RATE_LIMIT')).toBe('medium');
  });
});

describe('isAuthenticationError', () => {
  it('should return true for 401', () => {
    expect(isAuthenticationError({ response: { status: 401 } })).toBe(true);
  });

  it('should return false for 403', () => {
    expect(isAuthenticationError({ response: { status: 403 } })).toBe(false);
  });
});

describe('isAuthorizationError', () => {
  it('should return true for 403', () => {
    expect(isAuthorizationError({ response: { status: 403 } })).toBe(true);
  });

  it('should return false for 401', () => {
    expect(isAuthorizationError({ response: { status: 401 } })).toBe(false);
  });
});

describe('buildErrorContext', () => {
  it('should build context from error', () => {
    const error = {
      response: { status: 500 },
      config: {
        url: '/api/test',
        method: 'POST',
        headers: { 'X-Correlation-ID': 'abc123' },
      },
    };
    const ctx = buildErrorContext(error);
    expect(ctx.endpoint).toBe('/api/test');
    expect(ctx.method).toBe('POST');
    expect(ctx.statusCode).toBe(500);
    expect(ctx.correlationId).toBe('abc123');
  });

  it('should merge partial context', () => {
    const ctx = buildErrorContext({}, { endpoint: '/api/override', userId: 'user_1' });
    expect(ctx.endpoint).toBe('/api/override');
    expect(ctx.userId).toBe('user_1');
  });
});

describe('ERROR_CATEGORIES', () => {
  it('should have all categories defined', () => {
    const expectedCategories = [
      'NETWORK_ERROR', 'AUTHENTICATION_ERROR', 'AUTHORIZATION_ERROR',
      'VALIDATION_ERROR', 'NOT_FOUND', 'CONFLICT', 'RATE_LIMIT',
      'SERVER_ERROR', 'TIMEOUT', 'OFFLINE', 'PAYMENT_ERROR',
      'UPLOAD_ERROR', 'SUBSCRIPTION_ERROR', 'UNKNOWN_ERROR',
    ];
    for (const cat of expectedCategories) {
      const entry = (ERROR_CATEGORIES as any)[cat];
      expect(entry).toBeDefined();
      expect(entry.severity).toBeDefined();
      expect(typeof entry.retryable).toBe('boolean');
    }
  });
});
