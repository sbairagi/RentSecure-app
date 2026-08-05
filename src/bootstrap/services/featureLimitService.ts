import { apiService } from '@/services/api/apiClient';
import { logger } from '@/services/api/logger';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { FeatureLimitInfo } from '../types/bootstrap';

class FeatureLimitService {
  async loadFeatureLimits(): Promise<FeatureLimitInfo[]> {
    try {
      const response = await apiService.get<any>(BOOTSTRAP_CONSTANTS.API_ENDPOINTS.USAGE_LIMITS);
      const limits = response?.results || response || [];
      const featureLimits: FeatureLimitInfo[] = Array.isArray(limits)
        ? limits.map((l: any) => ({
            id: l.id,
            user: l.user,
            feature_key: l.feature_key,
            usage_count: l.usage_count || 0,
            updated_at: l.updated_at,
          }))
        : [];

      useSubscriptionStore.getState().setUsageLimits(featureLimits);
      logger.info('Feature limits loaded', { count: featureLimits.length });
      return featureLimits;
    } catch (error) {
      logger.error('Failed to load feature limits', error as Error);
      return [];
    }
  }

  async loadAddOns(): Promise<FeatureLimitInfo['id'][]> {
    try {
      const response = await apiService.get<any>(BOOTSTRAP_CONSTANTS.API_ENDPOINTS.ADDON_PURCHASES);
      const addOns = response?.results || response || [];
      const addOnList: any[] = Array.isArray(addOns) ? addOns : [];

      useSubscriptionStore.getState().setAddOns(
        addOnList.map((a: any) => ({
          id: a.id,
          user: a.user,
          name: a.name,
          amount: a.amount,
          is_recurring: a.is_recurring,
          purchase_date: a.purchase_date,
        }))
      );

      logger.info('Add-ons loaded', { count: addOnList.length });
      return addOnList.map((a: any) => a.id);
    } catch (error) {
      logger.error('Failed to load add-ons', error as Error);
      return [];
    }
  }

  getLimit(
    featureLimits: FeatureLimitInfo[],
    featureKey: string
  ): { limit: number | 'unlimited'; currentUsage: number } {
    const limit = featureLimits.find((l) => l.feature_key === featureKey);
    if (!limit) {
      return { limit: 'unlimited', currentUsage: 0 };
    }
    const limitVal = parseInt(limit.usage_count.toString(), 10);
    return {
      limit: limitVal === -1 || limitVal === Infinity ? 'unlimited' : limitVal,
      currentUsage: limit.usage_count,
    };
  }

  canUse(featureLimits: FeatureLimitInfo[], featureKey: string): boolean {
    const { limit, currentUsage } = this.getLimit(featureLimits, featureKey);
    if (limit === 'unlimited') return true;
    return currentUsage < limit;
  }

  clear(): void {
    useSubscriptionStore.getState().setUsageLimits([]);
    useSubscriptionStore.getState().setAddOns([]);
  }
}

export const featureLimitService = new FeatureLimitService();
