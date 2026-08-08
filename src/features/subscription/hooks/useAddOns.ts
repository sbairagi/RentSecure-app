import { useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionRepository } from '../repository';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';
import { SUBSCRIPTION_CONSTANTS } from '../constants';

export function useAddOns() {
  return useQuery({
    queryKey: ['subscription', 'addOns'],
    queryFn: async () => {
      const addOns = await subscriptionRepository.getAddOns();
      useSubscriptionFeatureStore.getState().setAddOns(addOns);
      return addOns;
    },
    staleTime: SUBSCRIPTION_CONSTANTS.CACHE.ADD_ONS_STALE_TIME,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useRefreshAddOns() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['subscription', 'addOns'] });
}
