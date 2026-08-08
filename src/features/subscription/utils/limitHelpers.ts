import type { EffectiveLimit, FeatureLimitEntry } from '../types';
import { FEATURE_LABELS } from '../types/limits';

export function effectiveLimitsToFeatureEntries(effectiveLimits: EffectiveLimit[]): FeatureLimitEntry[] {
  return effectiveLimits.map(limit => ({
    featureKey: limit.featureKey as FeatureLimitEntry['featureKey'],
    label: (FEATURE_LABELS as Record<string, string>)[limit.featureKey] || limit.featureKey,
    planLimit: limit.planLimit,
    addOnLimit: limit.addOnLimit,
    effectiveLimit: limit.effectiveLimit,
    currentUsage: limit.currentUsage,
    remaining: limit.remaining,
    percentageUsed: limit.percentageUsed,
    canUse: limit.canUse,
  }));
}
