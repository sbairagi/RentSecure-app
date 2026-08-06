import type { SubscriptionStatus } from '@/navigation/types/navigation.types';
import { apiService } from '@/services/api/apiClient';
import { useSubscriptionStore } from '@/store/subscriptionStore';

const API_ENDPOINTS = {
  SUBSCRIPTION_CURRENT: '/api/user-subscriptions/',
  ADDON_PURCHASES: '/api/addon-purchases/',
  USAGE_LIMITS: '/api/usage-limits/',
  SUBSCRIPTION_PLANS: '/api/subscription-plans/',
};

export const isSubscriptionExpired = (endDate: string | null | undefined): boolean => {
  if (!endDate) return true;
  return new Date(endDate) < new Date();
};

export const getDaysRemaining = (endDate: string | null | undefined): number | null => {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
};

export const getSubscriptionStatus = (
  subscription: { is_active: boolean; end_date: string } | null | undefined
): SubscriptionStatus => {
  if (!subscription) {
    return {
      isActive: false,
      isExpired: true,
      planName: 'free',
      endDate: null,
      daysRemaining: null,
    };
  }

  const expired = isSubscriptionExpired(subscription.end_date);
  return {
    isActive: subscription.is_active && !expired,
    isExpired: expired,
    planName: 'free',
    endDate: subscription.end_date,
    daysRemaining: getDaysRemaining(subscription.end_date),
  };
};

export const checkFeatureAccess = async (
  featureKey: string
): Promise<{ allowed: boolean; limit: number | 'unlimited'; currentUsage: number }> => {
  try {
    const limitsResponse = await apiService.get<any>(API_ENDPOINTS.USAGE_LIMITS);
    const limits = limitsResponse?.results || limitsResponse || [];
    const featureLimit = Array.isArray(limits)
      ? limits.find((l: any) => l.feature_key === featureKey)
      : null;

    if (!featureLimit) {
      return { allowed: true, limit: 'unlimited', currentUsage: 0 };
    }

    const limitVal = parseInt(featureLimit.limit || '-1', 10);
    const currentUsage = featureLimit.usage_count || 0;
    const allowed = limitVal === -1 || limitVal === Infinity || currentUsage < limitVal;

    return {
      allowed,
      limit: limitVal === -1 || limitVal === Infinity ? 'unlimited' : limitVal,
      currentUsage,
    };
  } catch {
    return { allowed: true, limit: 'unlimited', currentUsage: 0 };
  }
};

export const checkSubscriptionAccess = async (): Promise<{
  hasAccess: boolean;
  status: SubscriptionStatus;
}> => {
  try {
    const subsResponse = await apiService.get<any>(API_ENDPOINTS.SUBSCRIPTION_CURRENT);
    const subscriptions = subsResponse?.results || subsResponse || [];
    const activeSubscription = Array.isArray(subscriptions)
      ? subscriptions.find((s: any) => s.is_active && !isSubscriptionExpired(s.end_date))
      : null;

    const status = getSubscriptionStatus(activeSubscription);

    return {
      hasAccess: status.isActive,
      status,
    };
  } catch {
    return {
      hasAccess: false,
      status: {
        isActive: false,
        isExpired: true,
        planName: 'free',
        endDate: null,
        daysRemaining: null,
      },
    };
  }
};

export const fetchSubscriptionData = async (): Promise<void> => {
  try {
    const results = await Promise.allSettled([
      apiService.get<any>(API_ENDPOINTS.SUBSCRIPTION_CURRENT),
      apiService.get<any>(API_ENDPOINTS.ADDON_PURCHASES),
      apiService.get<any>(API_ENDPOINTS.USAGE_LIMITS),
      apiService.get<any>(API_ENDPOINTS.SUBSCRIPTION_PLANS),
    ]);

    const subsRes = results[0].status === 'fulfilled' ? results[0].value : null;
    const addOnsRes = results[1].status === 'fulfilled' ? results[1].value : null;
    const limitsRes = results[2].status === 'fulfilled' ? results[2].value : null;
    const plansRes = results[3].status === 'fulfilled' ? results[3].value : null;

    const subscriptions = subsRes?.results || subsRes || [];
    const activeSubscription = Array.isArray(subscriptions)
      ? subscriptions.find((s: any) => s.is_active)
      : null;

    const addOns = addOnsRes?.results || addOnsRes || [];
    const usageLimits = limitsRes?.results || limitsRes || [];
    const plans = plansRes?.results || plansRes || [];

    const { setSubscription, setAddOns, setUsageLimits, setPlans, setLoading, setError } =
      useSubscriptionStore.getState();

    if (activeSubscription) {
      setSubscription(activeSubscription);
    } else {
      setSubscription(null);
    }

    setAddOns(addOns);
    setUsageLimits(usageLimits);
    setPlans(plans);
    setLoading(false);
    setError(null);
  } catch (error) {
    console.error('Failed to fetch subscription data:', error);
    useSubscriptionStore.getState().setError('Failed to load subscription data');
    useSubscriptionStore.getState().setLoading(false);
  }
};

export const getAddOnLimit = (
  addOns: any[],
  featureKey: string
): { value: number | 'unlimited'; hasAddOn: boolean } => {
  const addOn = addOns.find((a) => a.name === featureKey && a.is_recurring);
  if (addOn) {
    return { value: 'unlimited', hasAddOn: true };
  }
  return { value: 0, hasAddOn: false };
};
