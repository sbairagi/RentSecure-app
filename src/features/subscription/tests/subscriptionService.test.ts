import { subscriptionService } from '../services/subscriptionService';

describe('subscriptionService', () => {
  describe('isExpired', () => {
    it('returns true for null subscription', () => {
      expect(subscriptionService.isExpired(null)).toBe(true);
    });

    it('returns true for past end_date', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      expect(subscriptionService.isExpired({ end_date: pastDate } as any)).toBe(true);
    });

    it('returns false for future end_date', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      expect(subscriptionService.isExpired({ end_date: futureDate } as any)).toBe(false);
    });
  });

  describe('getDaysRemaining', () => {
    it('returns null for null subscription', () => {
      expect(subscriptionService.getDaysRemaining(null)).toBe(null);
    });

    it('returns 0 for past end_date', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      expect(subscriptionService.getDaysRemaining({ end_date: pastDate } as any)).toBe(0);
    });

    it('returns positive number for future end_date', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const days = subscriptionService.getDaysRemaining({ end_date: futureDate } as any);
      expect(days).toBeGreaterThan(0);
    });
  });

  describe('canUpgrade', () => {
    it('returns true when upgrading from free to pro', () => {
      expect(subscriptionService.canUpgrade('free', 'pro')).toBe(true);
    });

    it('returns true when upgrading from pro to elite', () => {
      expect(subscriptionService.canUpgrade('pro', 'elite')).toBe(true);
    });

    it('returns false when same plan', () => {
      expect(subscriptionService.canUpgrade('pro', 'pro')).toBe(false);
    });

    it('returns false when downgrading', () => {
      expect(subscriptionService.canUpgrade('pro', 'free')).toBe(false);
    });
  });

  describe('canDowngrade', () => {
    it('returns true when downgrading from pro to free', () => {
      expect(subscriptionService.canDowngrade('pro', 'free')).toBe(true);
    });

    it('returns false when same plan', () => {
      expect(subscriptionService.canDowngrade('pro', 'pro')).toBe(false);
    });

    it('returns false when upgrading', () => {
      expect(subscriptionService.canDowngrade('free', 'pro')).toBe(false);
    });
  });
});
