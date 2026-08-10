import {
  classifyOperation,
  isOfflineSafe,
  isOnlineOnly,
  isSensitiveFinancial,
  getOfflineSafeResources,
  getOnlineOnlyResources,
} from '../utils/classification';

describe('Classification Utils', () => {
  describe('getOfflineSafeResources', () => {
    it('should return a list of offline-safe operations', () => {
      const resources = getOfflineSafeResources();
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
    });

    it('should only include offline-safe categories', () => {
      const resources = getOfflineSafeResources();
      resources.forEach((resource) => {
        const [method] = resource.split(' ');
        const [, endpoint] = resource.split(' ');
        const classification = classifyOperation(method, endpoint);
        expect(isOfflineSafe(classification.category)).toBe(true);
      });
    });
  });

  describe('getOnlineOnlyResources', () => {
    it('should return a list of online-only operations', () => {
      const resources = getOnlineOnlyResources();
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
    });

    it('should only include online-only or sensitive-financial categories', () => {
      const resources = getOnlineOnlyResources();
      resources.forEach((resource) => {
        const [method] = resource.split(' ');
        const [, endpoint] = resource.split(' ');
        const classification = classifyOperation(method, endpoint);
        expect(isOnlineOnly(classification.category) || isSensitiveFinancial(classification.category)).toBe(
          true
        );
      });
    });
  });

  describe('combined classification scenarios', () => {
    it('should correctly classify a full CRUD cycle for buildings', () => {
      expect(classifyOperation('GET', '/api/buildings/').category).toBe('read-only-cacheable');
      expect(classifyOperation('GET', '/api/buildings/1/').category).toBe('read-only-cacheable');
      expect(classifyOperation('POST', '/api/buildings/').category).toBe('online-only');
      expect(classifyOperation('POST', '/api/buildings/1/').category).toBe('online-only');
      expect(classifyOperation('DELETE', '/api/buildings/1/').category).toBe('online-only');
    });

    it('should correctly classify maintenance operations', () => {
      expect(classifyOperation('GET', '/maintenance/').category).toBe('read-only-cacheable');
      expect(classifyOperation('POST', '/maintenance/').category).toBe('offline-safe-mutation');
      expect(classifyOperation('POST', '/maintenance/1/').category).toBe('offline-safe-mutation');
      expect(classifyOperation('DELETE', '/maintenance/1/').category).toBe('online-only');
    });

    it('should correctly classify payment operations', () => {
      expect(classifyOperation('GET', '/payments/').category).toBe('read-only-cacheable');
      expect(classifyOperation('GET', '/payments/1/').category).toBe('read-only-cacheable');
      expect(classifyOperation('POST', '/payments/').category).toBe('sensitive-financial');
      expect(classifyOperation('POST', '/payments/1/refund/').category).toBe('sensitive-financial');
      expect(classifyOperation('DELETE', '/payments/1/').category).toBe('sensitive-financial');
    });

    it('should correctly classify visitor operations', () => {
      expect(classifyOperation('GET', '/api/visitors/').category).toBe('read-only-cacheable');
      expect(classifyOperation('POST', '/api/visitors/').category).toBe('offline-safe-mutation');
      expect(classifyOperation('POST', '/api/visitors/1/').category).toBe('offline-safe-mutation');
      expect(classifyOperation('POST', '/api/visitors/1/approve/').category).toBe('online-only');
      expect(classifyOperation('DELETE', '/api/visitors/1/').category).toBe('online-only');
    });

    it('should correctly classify auth operations', () => {
      expect(classifyOperation('POST', '/auth/login/').category).toBe('online-only');
      expect(classifyOperation('POST', '/auth/send-otp/').category).toBe('online-only');
      expect(classifyOperation('POST', '/auth/logout/').category).toBe('online-only');
      expect(classifyOperation('POST', '/change-password/').category).toBe('online-only');
    });
  });
});
