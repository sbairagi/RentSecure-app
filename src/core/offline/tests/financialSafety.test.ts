import {
  isFinancialResource,
  isFinancialEndpoint,
  isFinancialCategory,
  requiresOnlineConfirmation,
  getFinancialDisclaimer,
  getPaymentStatusDisclaimer,
  sanitizeFinancialData,
  validateFinancialOperation,
} from '../utils/financialSafety';

describe('Financial Safety', () => {
  describe('isFinancialResource', () => {
    it('should identify financial resources', () => {
      expect(isFinancialResource('payments')).toBe(true);
      expect(isFinancialResource('rentRecords')).toBe(true);
      expect(isFinancialResource('invoices')).toBe(true);
      expect(isFinancialResource('subscriptions')).toBe(true);
    });

    it('should not identify non-financial resources', () => {
      expect(isFinancialResource('buildings')).toBe(false);
      expect(isFinancialResource('units')).toBe(false);
      expect(isFinancialResource('notifications')).toBe(false);
    });
  });

  describe('isFinancialEndpoint', () => {
    it('should identify financial endpoints', () => {
      expect(isFinancialEndpoint('/payments/')).toBe(true);
      expect(isFinancialEndpoint('/payments/initiate/')).toBe(true);
      expect(isFinancialEndpoint('/subscriptions/upgrade/')).toBe(true);
      expect(isFinancialEndpoint('/owner/update-bank-details/')).toBe(true);
    });

    it('should not identify non-financial endpoints', () => {
      expect(isFinancialEndpoint('/api/buildings/')).toBe(false);
      expect(isFinancialEndpoint('/notifications/')).toBe(false);
    });
  });

  describe('isFinancialCategory', () => {
    it('should identify sensitive-financial category', () => {
      expect(isFinancialCategory('sensitive-financial')).toBe(true);
      expect(isFinancialCategory('online-only')).toBe(false);
      expect(isFinancialCategory('offline-safe-mutation')).toBe(false);
      expect(isFinancialCategory('read-only-cacheable')).toBe(false);
    });
  });

  describe('requiresOnlineConfirmation', () => {
    it('should require online for financial operations', () => {
      expect(requiresOnlineConfirmation('sensitive-financial')).toBe(true);
    });

    it('should require online for online-only operations', () => {
      expect(requiresOnlineConfirmation('online-only')).toBe(true);
    });

    it('should not require online for offline-safe operations', () => {
      expect(requiresOnlineConfirmation('offline-safe-mutation')).toBe(false);
      expect(requiresOnlineConfirmation('read-only-cacheable')).toBe(false);
    });
  });

  describe('getFinancialDisclaimer', () => {
    it('should return a non-empty disclaimer', () => {
      const disclaimer = getFinancialDisclaimer();
      expect(disclaimer.length).toBeGreaterThan(0);
      expect(disclaimer).toContain('outdated');
    });
  });

  describe('getPaymentStatusDisclaimer', () => {
    it('should return a non-empty disclaimer', () => {
      const disclaimer = getPaymentStatusDisclaimer();
      expect(disclaimer.length).toBeGreaterThan(0);
      expect(disclaimer).toContain('not confirmed');
    });
  });

  describe('sanitizeFinancialData', () => {
    it('should redact sensitive fields', () => {
      const data = {
        amount: '1000',
        card_number: '4111111111111111',
        cvv: '123',
        password: 'secret',
        description: 'test',
      };
      const sanitized = sanitizeFinancialData(data);
      expect(sanitized.amount).toBe('1000');
      expect(sanitized.card_number).toBe('[REDACTED]');
      expect(sanitized.cvv).toBe('[REDACTED]');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.description).toBe('test');
    });
  });

  describe('validateFinancialOperation', () => {
    it('should block financial operations when offline', () => {
      const result = validateFinancialOperation('sensitive-financial', false);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('internet connection');
    });

    it('should allow financial operations when online', () => {
      const result = validateFinancialOperation('sensitive-financial', true);
      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should block online-only operations when offline', () => {
      const result = validateFinancialOperation('online-only', false);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('internet connection');
    });

    it('should allow offline-safe operations when offline', () => {
      const result = validateFinancialOperation('offline-safe-mutation', false);
      expect(result.allowed).toBe(true);
    });
  });
});
