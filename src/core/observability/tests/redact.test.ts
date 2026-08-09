import { redactObject, redactHeaders, sanitizeForLogging, isSensitiveField } from '@/core/observability/utils/redact';

describe('redactObject', () => {
  it('should handle null', () => {
    expect(redactObject(null as any)).toBeNull();
  });

  it('should handle undefined', () => {
    expect(redactObject(undefined as any)).toBeUndefined();
  });

  it('should redact password fields', () => {
    const result = redactObject({ username: 'test', password: 'secret123' } as Record<string, any>);
    expect(result.password).toBe('[REDACTED]');
    expect(result.username).toBe('test');
  });

  it('should redact token fields', () => {
    const result = redactObject({ access_token: 'abc', refresh_token: 'xyz' } as Record<string, any>);
    expect(result.access_token).toBe('[REDACTED]');
    expect(result.refresh_token).toBe('[REDACTED]');
  });

  it('should redact nested objects', () => {
    const result = redactObject({
      user: { name: 'John', password: 'secret' } as Record<string, any>,
    } as Record<string, any>);
    expect(result.user.password).toBe('[REDACTED]');
    expect(result.user.name).toBe('John');
  });

  it('should redact arrays', () => {
    const result = redactObject([
      { name: 'item1', secret: 'value1' } as Record<string, any>,
      { name: 'item2', token: 'value2' } as Record<string, any>,
    ]) as Record<string, any>[];
    expect(result[0].secret).toBe('[REDACTED]');
    expect(result[1].token).toBe('[REDACTED]');
  });

  it('should handle null/undefined', () => {
    expect(redactObject(null as any)).toBeNull();
    expect(redactObject(undefined as any)).toBeUndefined();
  });
});

describe('redactHeaders', () => {
  it('should redact Authorization header', () => {
    const result = redactHeaders({ Authorization: 'Bearer token123', 'Content-Type': 'application/json' });
    expect(result.Authorization).toBe('[REDACTED]');
    expect(result['Content-Type']).toBe('application/json');
  });

  it('should redact cookie header', () => {
    const result = redactHeaders({ Cookie: 'session=abc' });
    expect(result.Cookie).toBe('[REDACTED]');
  });

  it('should handle empty headers', () => {
    expect(redactHeaders({})).toEqual({});
  });
});

describe('sanitizeForLogging', () => {
  it('should redact sensitive fields in nested objects', () => {
    const data = {
      request: {
        body: { password: 'secret', email: 'test@example.com' },
        headers: { Authorization: 'Bearer token' },
      },
    };
    const result = sanitizeForLogging(data);
    expect((result as any).request.body.password).toBe('[REDACTED]');
    expect((result as any).request.body.email).toBe('test@example.com');
  });

  it('should not exceed depth limit', () => {
    let deep: Record<string, any> = { a: 1 };
    for (let i = 0; i < 10; i++) {
      deep = { nested: deep };
    }
    const result = sanitizeForLogging(deep, 0);
    expect(result).toBeDefined();
  });
});

describe('isSensitiveField', () => {
  it('should detect password', () => {
    expect(isSensitiveField('password')).toBe(true);
  });

  it('should detect token', () => {
    expect(isSensitiveField('access_token')).toBe(true);
  });

  it('should detect cvv', () => {
    expect(isSensitiveField('cvv')).toBe(true);
  });

  it('should not detect safe fields', () => {
    expect(isSensitiveField('name')).toBe(false);
    expect(isSensitiveField('email')).toBe(false);
  });
});
