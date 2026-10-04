import {
  classifyOperation,
  isOfflineSafe,
  isOnlineOnly,
  isReadOnlyCacheable,
  isSensitiveFinancial,
  canQueueOffline,
  requiresNetwork,
} from '../utils/classification';

describe('Operation Classification', () => {
  describe('classifyOperation', () => {
    it('should classify GET requests as read-only-cacheable by default', () => {
      const result = classifyOperation('GET', '/api/unknown-endpoint/');
      expect(result.category).toBe('read-only-cacheable');
    });

    it('should classify known read endpoints as read-only-cacheable', () => {
      expect(classifyOperation('GET', '/api/buildings/').category).toBe('read-only-cacheable');
      expect(classifyOperation('GET', '/renters/').category).toBe('read-only-cacheable');
      expect(classifyOperation('GET', '/dashboard/stats/').category).toBe('read-only-cacheable');
    });

    it('should classify payment endpoints as sensitive-financial', () => {
      expect(classifyOperation('POST', '/payments/initiate/').category).toBe('sensitive-financial');
      expect(classifyOperation('POST', '/payments/verify/').category).toBe('sensitive-financial');
      expect(classifyOperation('POST', '/payments/1/refund/').category).toBe('sensitive-financial');
    });

    it('should classify auth endpoints as online-only', () => {
      expect(classifyOperation('POST', '/auth/login/').category).toBe('online-only');
      expect(classifyOperation('POST', '/auth/send-otp/').category).toBe('online-only');
      expect(classifyOperation('POST', '/change-password/').category).toBe('online-only');
    });

    it('should classify mutation endpoints with IDs', () => {
      expect(classifyOperation('POST', '/api/buildings/1/').category).toBe('online-only');
      expect(classifyOperation('PUT', '/renters/1/').category).toBe('offline-safe-mutation');
    });

    it('should normalize endpoints with query parameters', () => {
      const result = classifyOperation('GET', '/api/buildings/?page=1&limit=10');
      expect(result.category).toBe('read-only-cacheable');
    });
  });

  describe('classification helpers', () => {
    it('should identify offline-safe categories', () => {
      expect(isOfflineSafe('offline-safe-mutation')).toBe(true);
      expect(isOfflineSafe('read-only-cacheable')).toBe(false);
      expect(isOfflineSafe('online-only')).toBe(false);
      expect(isOfflineSafe('sensitive-financial')).toBe(false);
    });

    it('should identify online-only categories', () => {
      expect(isOnlineOnly('online-only')).toBe(true);
      expect(isOnlineOnly('sensitive-financial')).toBe(true);
      expect(isOnlineOnly('offline-safe-mutation')).toBe(false);
      expect(isOnlineOnly('read-only-cacheable')).toBe(false);
    });

    it('should identify read-only-cacheable categories', () => {
      expect(isReadOnlyCacheable('read-only-cacheable')).toBe(true);
      expect(isReadOnlyCacheable('offline-safe-mutation')).toBe(false);
    });

    it('should identify sensitive-financial categories', () => {
      expect(isSensitiveFinancial('sensitive-financial')).toBe(true);
      expect(isSensitiveFinancial('online-only')).toBe(false);
    });

    it('should determine if operation can be queued offline', () => {
      expect(canQueueOffline('offline-safe-mutation')).toBe(true);
      expect(canQueueOffline('read-only-cacheable')).toBe(true);
      expect(canQueueOffline('online-only')).toBe(false);
      expect(canQueueOffline('sensitive-financial')).toBe(false);
    });

    it('should determine if operation requires network', () => {
      expect(requiresNetwork('online-only')).toBe(true);
      expect(requiresNetwork('sensitive-financial')).toBe(true);
      expect(requiresNetwork('offline-safe-mutation')).toBe(false);
      expect(requiresNetwork('read-only-cacheable')).toBe(false);
    });
  });
});
