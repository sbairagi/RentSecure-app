import { DeepLinkValidator } from '../validation/urlValidator';

describe('DeepLinkValidator', () => {
  describe('validatePayload', () => {
    it('should reject null payload', () => {
      const result = DeepLinkValidator.validatePayload(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid deep link payload');
    });

    it('should reject invalid type', () => {
      const result = DeepLinkValidator.validatePayload({ type: 'invalid_type' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid deep link type');
    });

    it('should reject short tokens', () => {
      const result = DeepLinkValidator.validatePayload({ type: 'payment', token: 'abc' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid token format');
    });

    it('should reject empty IDs', () => {
      const result = DeepLinkValidator.validatePayload({ type: 'building', id: '' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid resource ID');
    });

    it('should accept valid payment deep link', () => {
      const payload = { type: 'payment', token: 'valid_token_12345', id: '123' };
      const result = DeepLinkValidator.validatePayload(payload);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid building deep link', () => {
      const payload = { type: 'building', id: '456' };
      const result = DeepLinkValidator.validatePayload(payload);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid notification deep link', () => {
      const payload = { type: 'notification', id: '789' };
      const result = DeepLinkValidator.validatePayload(payload);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateResourceAccess', () => {
    it('should return false for null role', () => {
      expect(DeepLinkValidator.validateResourceAccess(null, 'building')).toBe(false);
    });

    it('should allow owner to access buildings', () => {
      expect(DeepLinkValidator.validateResourceAccess('property_owner', 'building')).toBe(true);
    });

    it('should deny renter access to buildings', () => {
      expect(DeepLinkValidator.validateResourceAccess('renter', 'building')).toBe(false);
    });

    it('should allow renter to access rent records', () => {
      expect(DeepLinkValidator.validateResourceAccess('renter', 'rent-record')).toBe(true);
    });

    it('should allow caretaker to access units', () => {
      expect(DeepLinkValidator.validateResourceAccess('caretaker', 'unit')).toBe(true);
    });

    it('should allow super_admin to access all resources', () => {
      expect(DeepLinkValidator.validateResourceAccess('super_admin', 'document')).toBe(true);
    });
  });

  describe('sanitizeUrl', () => {
    it('should accept HTTPS URLs', () => {
      const result = DeepLinkValidator.sanitizeUrl('https://app.rentsecureapp.com/payment');
      expect(result.isValid).toBe(true);
    });

    it('should reject URLs with sensitive parameters', () => {
      const result = DeepLinkValidator.sanitizeUrl(
        'https://app.rentsecureapp.com/payment?token=secret'
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('sensitive');
    });

    it('should reject invalid URLs', () => {
      const result = DeepLinkValidator.sanitizeUrl('not-a-url');
      expect(result.isValid).toBe(false);
    });
  });
});
