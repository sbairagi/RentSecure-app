import type { AddOnPurchase, EffectiveLimit, PlanFeatureLimit, SubscriptionPlan, UsageLimit } from '../types';
import { isBooleanFeature, isNumericFeature } from '../constants/features';
import { SUBSCRIPTION_CONSTANTS } from '../constants';

export class LimitService {
  getPlanLimit(featureLimits: PlanFeatureLimit[], planId: number, featureKey: string): number | 'unlimited' {
    const limit = featureLimits.find(l => l.plan === planId && l.feature_key === featureKey);
    if (!limit) return 0;
    if (limit.value === 'unlimited') return 'unlimited';
    const parsed = parseInt(limit.value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }

  getAddOnLimit(addOns: AddOnPurchase[], featureKey: string): number {
    return addOns
      .filter(a => a.name === featureKey)
      .reduce((sum, a) => sum + parseFloat(a.amount), 0);
  }

  computeEffectiveLimit(
    featureLimits: PlanFeatureLimit[],
    addOns: AddOnPurchase[],
    plan: SubscriptionPlan | null,
    usage: UsageLimit | undefined,
    featureKey: string
  ): EffectiveLimit {
    const planLimit = plan ? this.getPlanLimit(featureLimits, plan.id, featureKey) : 0;
    const addOnLimit = this.getAddOnLimit(addOns, featureKey);

    let effectiveLimit: number | 'unlimited';
    if (planLimit === 'unlimited') {
      effectiveLimit = 'unlimited';
    } else {
      effectiveLimit = planLimit + addOnLimit;
    }

    const currentUsage = usage?.usage_count ?? 0;
    const remaining = effectiveLimit === 'unlimited' ? 'unlimited' : effectiveLimit - currentUsage;
    const percentageUsed = effectiveLimit === 'unlimited' || effectiveLimit === 0 ? 0 : Math.min(100, (currentUsage / effectiveLimit) * 100);
    const canUse = effectiveLimit === 'unlimited' ? true : currentUsage < effectiveLimit;

    return {
      featureKey: featureKey as any,
      planLimit,
      addOnLimit,
      effectiveLimit,
      currentUsage,
      remaining,
      percentageUsed,
      canUse,
    };
  }

  computeAllEffectiveLimits(
    featureLimits: PlanFeatureLimit[],
    addOns: AddOnPurchase[],
    plan: SubscriptionPlan | null,
    usageLimits: UsageLimit[],
    featureKeys: string[]
  ): EffectiveLimit[] {
    return featureKeys.map(key => {
      const usage = usageLimits.find(u => u.feature_key === key);
      return this.computeEffectiveLimit(featureLimits, addOns, plan, usage, key);
    });
  }
}

export const limitService = new LimitService();
