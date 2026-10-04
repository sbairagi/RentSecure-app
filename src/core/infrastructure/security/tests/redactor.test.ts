import { Redactor } from '../redaction/redactor';

describe('Redactor', () => {
  describe('redactObject', () => {
    it('should redact password fields', () => {
      const result = Redactor.redactObject({ password: 'secret123' });
      expect(result.redacted.password).toBe('[REDACTED]');
      expect(result.fieldsRedacted).toContain('password');
    });

    it('should redact token fields', () => {
      const result = Redactor.redactObject({
        access_token: 'abc',
        refresh_token: 'xyz',
      });
      expect(result.redacted.access_token).toBe('[REDACTED]');
      expect(result.redacted.refresh_token).toBe('[REDACTED]');
    });

    it('should redact nested objects', () => {
      const result = Redactor.redactObject({
        user: { password: 'secret', name: 'John' },
      });
      expect(result.redacted.user.password).toBe('[REDACTED]');
      expect(result.redacted.user.name).toBe('John');
    });

    it('should handle empty objects', () => {
      const result = Redactor.redactObject({});
      expect(result.redacted).toEqual({});
      expect(result.fieldsRedacted).toEqual([]);
    });

    it('should redact custom sensitive fields', () => {
      const result = Redactor.redactObject(
        { custom_secret: 'value' },
        ['custom_secret']
      );
      expect(result.redacted.custom_secret).toBe('[REDACTED]');
    });
  });

  describe('redactHeaders', () => {
    it('should redact authorization header', () => {
      const headers = {
        Authorization: 'Bearer token123',
        'Content-Type': 'application/json',
      };
      const result = Redactor.redactHeaders(headers);
      expect(result.Authorization).toBe('[REDACTED]');
      expect(result['Content-Type']).toBe('application/json');
    });

    it('should redact cookie header', () => {
      const headers = { Cookie: 'session=abc' };
      const result = Redactor.redactHeaders(headers);
      expect(result.Cookie).toBe('[REDACTED]');
    });

    it('should handle undefined headers', () => {
      const result = Redactor.redactHeaders(undefined);
      expect(result).toEqual({});
    });
  });

  describe('redactString', () => {
    it('should redact email addresses', () => {
      const result = Redactor.redactString('Contact test@example.com');
      expect(result).not.toContain('test@example.com');
      expect(result).toContain('[REDACTED]');
    });

    it('should redact Bearer tokens', () => {
      const result = Redactor.redactString('Authorization: Bearer abc123');
      expect(result).not.toContain('Bearer abc123');
      expect(result).toContain('[REDACTED]');
    });

    it('should redact JWT-like strings', () => {
      const result = Redactor.redactString('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0');
      expect(result).not.toContain('eyJ');
      expect(result).toContain('[REDACTED]');
    });
  });

  describe('redactDeepLinkPayload', () => {
    it('should redact tokens in deep links', () => {
      const result = Redactor.redactDeepLinkPayload({
        type: 'payment',
        token: 'payment_token_12345',
      });
      expect(result.sanitizedPayload?.token).toBe('[REDACTED_TOKEN]');
    });

    it('should redact numeric IDs', () => {
      const result = Redactor.redactDeepLinkPayload({
        type: 'rent_record',
        id: '12345',
      });
      expect(result.sanitizedPayload?.id).toBe('[REDACTED_ID]');
    });
  });

  describe('redactApiResponse', () => {
    it('should redact sensitive fields in API responses', () => {
      const response = {
        user: { password: 'secret', name: 'John' },
        razorpay_order_id: 'order_123',
      };
      const result = Redactor.redactApiResponse(response);
      expect((result as any).user.password).toBe('[REDACTED]');
      expect((result as any).razorpay_order_id).toBe('[REDACTED]');
      expect((result as any).user.name).toBe('John');
    });

    it('should handle arrays', () => {
      const result = Redactor.redactApiResponse([{ password: 'secret' }]);
      expect((result as any)[0].password).toBe('[REDACTED]');
    });
  });
});
