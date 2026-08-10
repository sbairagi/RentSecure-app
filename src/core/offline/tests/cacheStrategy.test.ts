import { getCachePolicy, getFreshnessLevel, getFreshnessLabel, getFreshnessColor, shouldShowStaleWarning, isCacheExpired, isCacheStale } from '../cache/cacheStrategy';

describe('Cache Strategy', () => {
  describe('getCachePolicy', () => {
    it('should return policy for known resources', () => {
      const policy = getCachePolicy('buildings');
      expect(policy.staleTime).toBe(5 * 60_000);
      expect(policy.cacheTime).toBe(10 * 60_000);
      expect(policy.financialSensitive).toBe(false);
    });

    it('should return policy for financial resources', () => {
      const paymentsPolicy = getCachePolicy('payments');
      expect(paymentsPolicy.financialSensitive).toBe(true);
      expect(paymentsPolicy.staleTime).toBeLessThan(60_000);

      const rentRecordsPolicy = getCachePolicy('rentRecords');
      expect(rentRecordsPolicy.financialSensitive).toBe(true);
    });

    it('should return default policy for unknown resources', () => {
      const policy = getCachePolicy('unknown_resource');
      expect(policy.staleTime).toBe(5 * 60_000);
      expect(policy.cacheTime).toBe(10 * 60_000);
    });
  });

  describe('getFreshnessLevel', () => {
    const now = Date.now();

    it('should return unavailable for null timestamp', () => {
      const policy = getCachePolicy('buildings');
      expect(getFreshnessLevel(null, policy, true)).toBe('unavailable');
    });

    it('should return unavailable for expired cache', () => {
      const policy = getCachePolicy('buildings');
      const expired = now - policy.cacheTime - 1000;
      expect(getFreshnessLevel(expired, policy, true)).toBe('unavailable');
    });

    it('should return fresh for recent cache when online', () => {
      const policy = getCachePolicy('buildings');
      const recent = now - policy.staleTime / 2;
      expect(getFreshnessLevel(recent, policy, true)).toBe('fresh');
    });

    it('should return stale for old cache when online', () => {
      const policy = getCachePolicy('buildings');
      const old = now - policy.staleTime - 1000;
      expect(getFreshnessLevel(old, policy, true)).toBe('stale');
    });

    it('should return offline-cached when offline', () => {
      const policy = getCachePolicy('buildings');
      const recent = now - policy.staleTime / 2;
      expect(getFreshnessLevel(recent, policy, false)).toBe('offline-cached');
    });
  });

  describe('getFreshnessLabel', () => {
    it('should return correct labels', () => {
      expect(getFreshnessLabel('fresh')).toBe('Up to date');
      expect(getFreshnessLabel('stale')).toBe('Data may be outdated');
      expect(getFreshnessLabel('offline-cached')).toBe('Showing cached data');
      expect(getFreshnessLabel('unavailable')).toBe('No cached data available');
    });
  });

  describe('getFreshnessColor', () => {
    it('should return correct colors', () => {
      expect(getFreshnessColor('fresh')).toBe('#166534');
      expect(getFreshnessColor('stale')).toBe('#92400e');
      expect(getFreshnessColor('offline-cached')).toBe('#1e40af');
      expect(getFreshnessColor('unavailable')).toBe('#991b1b');
    });
  });

  describe('shouldShowStaleWarning', () => {
    it('should show warning for stale and offline-cached', () => {
      expect(shouldShowStaleWarning('fresh')).toBe(false);
      expect(shouldShowStaleWarning('stale')).toBe(true);
      expect(shouldShowStaleWarning('offline-cached')).toBe(true);
      expect(shouldShowStaleWarning('unavailable')).toBe(false);
    });
  });

  describe('isCacheExpired', () => {
    it('should return true for null timestamp', () => {
      const policy = getCachePolicy('buildings');
      expect(isCacheExpired(null, policy)).toBe(true);
    });

    it('should return true for expired cache', () => {
      const policy = getCachePolicy('buildings');
      expect(isCacheExpired(Date.now() - policy.cacheTime - 1000, policy)).toBe(true);
    });

    it('should return false for valid cache', () => {
      const policy = getCachePolicy('buildings');
      expect(isCacheExpired(Date.now(), policy)).toBe(false);
    });
  });

  describe('isCacheStale', () => {
    it('should return true for null timestamp', () => {
      const policy = getCachePolicy('buildings');
      expect(isCacheStale(null, policy)).toBe(true);
    });

    it('should return true for stale cache', () => {
      const policy = getCachePolicy('buildings');
      expect(isCacheStale(Date.now() - policy.staleTime - 1000, policy)).toBe(true);
    });

    it('should return false for fresh cache', () => {
      const policy = getCachePolicy('buildings');
      expect(isCacheStale(Date.now(), policy)).toBe(false);
    });
  });
});
