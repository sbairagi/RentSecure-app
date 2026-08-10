import { HttpsEnforcer } from '../network/httpsEnforcer';

describe('HttpsEnforcer', () => {
  describe('isSecureUrl', () => {
    it('should return true for HTTPS URLs', () => {
      expect(HttpsEnforcer.isSecureUrl('https://api.example.com')).toBe(true);
    });

    it('should return false for HTTP URLs', () => {
      expect(HttpsEnforcer.isSecureUrl('http://api.example.com')).toBe(false);
    });

    it('should return true for localhost HTTP in dev', () => {
      expect(HttpsEnforcer.isSecureUrl('http://localhost:8000/api')).toBe(true);
    });

    it('should return true for 127.0.0.1 HTTP in dev', () => {
      expect(HttpsEnforcer.isSecureUrl('http://127.0.0.1:8000/api')).toBe(true);
    });

    it('should return false for null/undefined', () => {
      expect(HttpsEnforcer.isSecureUrl(null)).toBe(false);
      expect(HttpsEnforcer.isSecureUrl(undefined)).toBe(false);
    });
  });

  describe('enforceHttps', () => {
    it('should allow HTTPS URLs', () => {
      const result = HttpsEnforcer.enforceHttps('https://api.example.com');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedUrl).toBe('https://api.example.com');
    });

    it('should block HTTP URLs in production', () => {
      const result = HttpsEnforcer.enforceHttps('http://api.example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('blocked');
    });

    it('should allow HTTP for localhost in development', () => {
      const result = HttpsEnforcer.enforceHttps('http://localhost:8000/api');
      expect(result.isValid).toBe(true);
    });

    it('should return error for invalid URL', () => {
      const result = HttpsEnforcer.enforceHttps('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid URL');
    });
  });

  describe('validateApiBaseUrl', () => {
    it('should validate a proper API URL', () => {
      const result = HttpsEnforcer.validateApiBaseUrl('https://api.example.com/api/');
      expect(result.isValid).toBe(true);
    });

    it('should reject URLs without path', () => {
      const result = HttpsEnforcer.validateApiBaseUrl('https://api.example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('path prefix');
    });

    it('should reject null URLs', () => {
      const result = HttpsEnforcer.validateApiBaseUrl(null);
      expect(result.isValid).toBe(false);
    });
  });
});
