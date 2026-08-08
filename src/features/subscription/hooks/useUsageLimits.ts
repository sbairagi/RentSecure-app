import { useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionRepository } from '../repository';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';
import { SUBSCRIPTION_CONSTANTS } from '../constants';

export function useUsageLimits() {
  return useQuery({
    queryKey: ['subscription', 'usageLimits'],
    queryFn: async () => {
      const limits = await subscriptionRepository.getUsageLimits();
      useSubscriptionFeatureStore.getState().setUsageLimits(limits);
      return limits;
    },
    staleTime: SUBSCRIPTION_CONSTANTS.CACHE.USAGE_LIMITS_STALE_TIME,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useRefreshUsageLimits() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['subscription', 'usageLimits'] });
}
