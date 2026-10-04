import { CryptoUtils } from '../utils/crypto';

describe('CryptoUtils', () => {
  describe('generateRandomString', () => {
    it('should generate string of requested length', () => {
      const result = CryptoUtils.generateRandomString(16);
      expect(result.length).toBe(16);
    });

    it('should generate different strings on each call', () => {
      const r1 = CryptoUtils.generateRandomString(16);
      const r2 = CryptoUtils.generateRandomString(16);
      expect(r1).not.toBe(r2);
    });
  });

  describe('generateNumericCode', () => {
    it('should generate numeric code of requested length', () => {
      const result = CryptoUtils.generateNumericCode(6);
      expect(result.length).toBe(6);
      expect(/^\d+$/.test(result)).toBe(true);
    });
  });

  describe('hashString', () => {
    it('should produce consistent hash', () => {
      const h1 = CryptoUtils.hashString('test');
      const h2 = CryptoUtils.hashString('test');
      expect(h1).toBe(h2);
    });

    it('should produce different hashes for different inputs', () => {
      expect(CryptoUtils.hashString('test1')).not.toBe(CryptoUtils.hashString('test2'));
    });
  });

  describe('generateCorrelationId', () => {
    it('should generate unique correlation IDs', () => {
      const id1 = CryptoUtils.generateCorrelationId();
      const id2 = CryptoUtils.generateCorrelationId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^[a-z0-9_]+$/);
    });
  });

  describe('maskSensitive', () => {
    it('should mask sensitive values', () => {
      expect(CryptoUtils.maskSensitive('1234567890', 4)).toBe('******7890');
    });

    it('should redact short values', () => {
      expect(CryptoUtils.maskSensitive('123', 4)).toBe('[REDACTED]');
    });
  });
});
