import { useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionRepository } from '../repository';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';
import { SUBSCRIPTION_CONSTANTS } from '../constants';

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: async () => {
      const plans = await subscriptionRepository.getPlans();
      useSubscriptionFeatureStore.getState().setPlans(plans);
      return plans;
    },
    staleTime: SUBSCRIPTION_CONSTANTS.CACHE.PLANS_STALE_TIME,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}

export function useRefreshPlans() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['subscription', 'plans'] });
}
