import { validatePlanTransition, validateSubscriptionDates } from '../validations/subscriptionValidation';

describe('subscriptionValidation', () => {
  describe('validatePlanTransition', () => {
    it('returns valid for upgrade from free to pro', () => {
      const result = validatePlanTransition('free', 'pro');
      expect(result.valid).toBe(true);
    });

    it('returns valid for upgrade from pro to elite', () => {
      const result = validatePlanTransition('pro', 'elite');
      expect(result.valid).toBe(true);
    });

    it('returns invalid for same plan', () => {
      const result = validatePlanTransition('pro', 'pro');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('You are already on this plan');
    });

    it('returns invalid for unknown plan', () => {
      const result = validatePlanTransition('free', 'unknown');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid plan selected');
    });
  });

  describe('validateSubscriptionDates', () => {
    it('returns valid for future end_date', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-12-31';
      const result = validateSubscriptionDates(startDate, endDate);
      expect(result.valid).toBe(true);
    });

    it('returns invalid for end_date before start_date', () => {
      const result = validateSubscriptionDates('2024-12-31', '2024-01-01');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('returns invalid for invalid start_date', () => {
      const result = validateSubscriptionDates('invalid', '2024-12-31');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid start date');
    });
  });
});
