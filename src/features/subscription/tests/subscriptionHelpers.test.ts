import {
  isSubscriptionExpired,
  getDaysRemaining,
  getSubscriptionStatus,
} from '../utils/subscriptionHelpers';
import { formatCurrency, formatDate, getPlanDisplayName } from '../utils/formatting';

describe('subscriptionHelpers', () => {
  describe('isSubscriptionExpired', () => {
    it('returns true for null end_date', () => {
      expect(isSubscriptionExpired(null)).toBe(true);
      expect(isSubscriptionExpired(undefined)).toBe(true);
    });

    it('returns true for past date', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      expect(isSubscriptionExpired(pastDate)).toBe(true);
    });

    it('returns false for future date', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      expect(isSubscriptionExpired(futureDate)).toBe(false);
    });
  });

  describe('getDaysRemaining', () => {
    it('returns null for null end_date', () => {
      expect(getDaysRemaining(null)).toBe(null);
      expect(getDaysRemaining(undefined)).toBe(null);
    });

    it('returns 0 for past date', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      expect(getDaysRemaining(pastDate)).toBe(0);
    });
  });

  describe('getSubscriptionStatus', () => {
    it('returns expired status for null subscription', () => {
      const status = getSubscriptionStatus(null);
      expect(status.isExpired).toBe(true);
      expect(status.isActive).toBe(false);
      expect(status.planName).toBe('free');
    });

    it('returns active status for valid subscription', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const status = getSubscriptionStatus({
        is_active: true,
        end_date: futureDate,
      });
      expect(status.isExpired).toBe(false);
      expect(status.isActive).toBe(true);
    });
  });

  describe('formatCurrency', () => {
    it('formats number as INR currency', () => {
      expect(formatCurrency(1500)).toContain('1,500');
    });

    it('formats string as INR currency', () => {
      expect(formatCurrency('1500')).toContain('1,500');
    });
  });

  describe('formatDate', () => {
    it('returns N/A for null', () => {
      expect(formatDate(null)).toBe('N/A');
    });

    it('returns N/A for undefined', () => {
      expect(formatDate(undefined)).toBe('N/A');
    });

    it('formats valid date', () => {
      const result = formatDate('2024-12-31');
      expect(result).toContain('2024');
    });
  });

  describe('getPlanDisplayName', () => {
    it('returns capitalized plan names', () => {
      expect(getPlanDisplayName('free')).toBe('Free');
      expect(getPlanDisplayName('pro')).toBe('Pro');
      expect(getPlanDisplayName('elite')).toBe('Elite');
    });

    it('returns original name for unknown plans', () => {
      expect(getPlanDisplayName('unknown')).toBe('unknown');
    });
  });
});
