/**
 * Unit tests for navigation security utilities.
 */

import {
  sanitizeRouteInput,
  sanitizeResourceId,
  sanitizeToken,
  isSensitiveParameter,
  sanitizeQueryParams,
  validateDeepLinkSecurity,
} from '@/navigation/utils/securityUtils';

describe('Security Utilities', () => {
  describe('sanitizeRouteInput', () => {
    it('should remove HTML characters', () => {
      expect(sanitizeRouteInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    });

    it('should remove quotes', () => {
      expect(sanitizeRouteInput("test'value")).toBe("testvalue");
    });

    it('should trim whitespace', () => {
      expect(sanitizeRouteInput('  test  ')).toBe('test');
    });

    it('should truncate long strings', () => {
      const longInput = 'a'.repeat(300);
      const result = sanitizeRouteInput(longInput);
      expect(result?.length).toBeLessThanOrEqual(256);
    });

    it('should return undefined for null input', () => {
      expect(sanitizeRouteInput(null)).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(sanitizeRouteInput('')).toBeUndefined();
    });
  });

  describe('sanitizeResourceId', () => {
    it('should remove special characters', () => {
      expect(sanitizeResourceId('abc!@#123')).toBe('abc123');
    });

    it('should truncate long IDs', () => {
      const longId = 'a'.repeat(100);
      const result = sanitizeResourceId(longId);
      expect(result?.length).toBeLessThanOrEqual(64);
    });

    it('should return undefined for null input', () => {
      expect(sanitizeResourceId(null)).toBeUndefined();
    });

    it('should preserve valid characters', () => {
      expect(sanitizeResourceId('abc-123_xyz')).toBe('abc-123_xyz');
    });
  });

  describe('sanitizeToken', () => {
    it('should remove newlines', () => {
      expect(sanitizeToken('abc\n123')).toBe('abc123');
    });

    it('should remove tabs', () => {
      expect(sanitizeToken('abc\t123')).toBe('abc123');
    });

    it('should trim whitespace', () => {
      expect(sanitizeToken('  token  ')).toBe('token');
    });

    it('should truncate long tokens', () => {
      const longToken = 'a'.repeat(200);
      const result = sanitizeToken(longToken);
      expect(result?.length).toBeLessThanOrEqual(128);
    });

    it('should return undefined for null input', () => {
      expect(sanitizeToken(null)).toBeUndefined();
    });
  });

  describe('isSensitiveParameter', () => {
    it('should detect password parameter', () => {
      expect(isSensitiveParameter('password')).toBe(true);
      expect(isSensitiveParameter('userPassword')).toBe(true);
    });

    it('should detect token parameter', () => {
      expect(isSensitiveParameter('token')).toBe(true);
      expect(isSensitiveParameter('access_token')).toBe(true);
      expect(isSensitiveParameter('refreshToken')).toBe(true);
    });

    it('should detect key parameter', () => {
      expect(isSensitiveParameter('api_key')).toBe(true);
      expect(isSensitiveParameter('privateKey')).toBe(true);
    });

    it('should detect OTP parameter', () => {
      expect(isSensitiveParameter('otp')).toBe(true);
      expect(isSensitiveParameter('otpCode')).toBe(true);
    });

    it('should detect bank parameter', () => {
      expect(isSensitiveParameter('bank')).toBe(true);
      expect(isSensitiveParameter('bankAccount')).toBe(true);
    });

    it('should allow non-sensitive parameters', () => {
      expect(isSensitiveParameter('name')).toBe(false);
      expect(isSensitiveParameter('email')).toBe(false);
      expect(isSensitiveParameter('phone')).toBe(false);
      expect(isSensitiveParameter('address')).toBe(false);
    });
  });

  describe('sanitizeQueryParams', () => {
    it('should remove sensitive parameters', () => {
      const result = sanitizeQueryParams({
        name: 'John',
        password: 'secret123',
        token: 'abc123',
      });
      expect(result.name).toBe('John');
      expect(result.password).toBeUndefined();
      expect(result.token).toBeUndefined();
    });

    it('should sanitize non-sensitive values', () => {
      const result = sanitizeQueryParams({
        name: '<script>John</script>',
      });
      expect(result.name).toBe('scriptJohn/script');
    });
  });

  describe('validateDeepLinkSecurity', () => {
    it('should pass for safe payload', () => {
      const result = validateDeepLinkSecurity({ type: 'building', id: '123' });
      expect(result.safe).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('should warn about sensitive parameters', () => {
      const result = validateDeepLinkSecurity({ type: 'payment', token: 'abc' });
      expect(result.safe).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should warn about long parameters', () => {
      const result = validateDeepLinkSecurity({
        type: 'building',
        id: 'a'.repeat(2000),
      });
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should warn about suspicious characters', () => {
      const result = validateDeepLinkSecurity({
        type: 'building',
        id: 'abc<script>',
      });
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
