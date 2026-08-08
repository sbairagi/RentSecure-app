import { limitService } from '../services/limitService';
import type { PlanFeatureLimit, AddOnPurchase, SubscriptionPlan, UsageLimit } from '../types';

describe('limitService', () => {
  const mockPlan: SubscriptionPlan = {
    id: 1,
    name: 'pro',
    monthly_price: '999',
    yearly_price: '9999',
    features: 'Buildings, Units, Renters',
    is_active: true,
  };

  const mockFeatureLimits: PlanFeatureLimit[] = [
    { id: 1, plan: 1, feature_key: 'max_buildings', value: '10' },
    { id: 2, plan: 1, feature_key: 'max_units', value: '50' },
    { id: 3, plan: 1, feature_key: 'tax_notifications', value: 'yes' },
  ];

  const mockAddOns: AddOnPurchase[] = [
    { id: 1, user: 1, name: 'max_buildings', amount: '5', is_recurring: true, purchase_date: '2024-01-01' },
  ];

  const mockUsage: UsageLimit = {
    id: 1,
    user: 1,
    feature_key: 'max_buildings',
    usage_count: 7,
    updated_at: '2024-01-01',
  };

  describe('getPlanLimit', () => {
    it('returns numeric limit for feature', () => {
      const limit = limitService.getPlanLimit(mockFeatureLimits, 1, 'max_buildings');
      expect(limit).toBe(10);
    });

    it('returns unlimited for unlimited value', () => {
      const limits: PlanFeatureLimit[] = [
        { id: 1, plan: 1, feature_key: 'max_buildings', value: 'unlimited' },
      ];
      expect(limitService.getPlanLimit(limits, 1, 'max_buildings')).toBe('unlimited');
    });

    it('returns 0 for missing feature', () => {
      expect(limitService.getPlanLimit(mockFeatureLimits, 1, 'nonexistent')).toBe(0);
    });
  });

  describe('getAddOnLimit', () => {
    it('returns sum of add-on amounts', () => {
      const addOns: AddOnPurchase[] = [
        { id: 1, user: 1, name: 'max_buildings', amount: '5', is_recurring: true, purchase_date: '' },
        { id: 2, user: 1, name: 'max_buildings', amount: '3', is_recurring: true, purchase_date: '' },
      ];
      expect(limitService.getAddOnLimit(addOns, 'max_buildings')).toBe(8);
    });

    it('returns 0 for no matching add-ons', () => {
      expect(limitService.getAddOnLimit(mockAddOns, 'max_units')).toBe(0);
    });
  });

  describe('computeEffectiveLimit', () => {
    it('computes effective limit as plan + add-on', () => {
      const result = limitService.computeEffectiveLimit(
        mockFeatureLimits,
        mockAddOns,
        mockPlan,
        mockUsage,
        'max_buildings'
      );
      expect(result.planLimit).toBe(10);
      expect(result.addOnLimit).toBe(5);
      expect(result.effectiveLimit).toBe(15);
      expect(result.currentUsage).toBe(7);
      expect(result.remaining).toBe(8);
      expect(result.canUse).toBe(true);
    });

    it('marks as unlimited when plan is unlimited', () => {
      const unlimitedLimits: PlanFeatureLimit[] = [
        { id: 1, plan: 1, feature_key: 'max_buildings', value: 'unlimited' },
      ];
      const result = limitService.computeEffectiveLimit(
        unlimitedLimits,
        [],
        mockPlan,
        undefined,
        'max_buildings'
      );
      expect(result.effectiveLimit).toBe('unlimited');
      expect(result.canUse).toBe(true);
    });

    it('returns canUse false when limit reached', () => {
      const fullUsage: UsageLimit = {
        id: 1,
        user: 1,
        feature_key: 'max_buildings',
        usage_count: 15,
        updated_at: '2024-01-01',
      };
      const result = limitService.computeEffectiveLimit(
        mockFeatureLimits,
        mockAddOns,
        mockPlan,
        fullUsage,
        'max_buildings'
      );
      expect(result.canUse).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });
});
