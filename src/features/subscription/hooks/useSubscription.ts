import { useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionRepository } from '../repository';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';
import { SUBSCRIPTION_CONSTANTS } from '../constants';

export function useSubscription() {
  const queryClient = useQueryClient();
  const { setSubscription, setPlans, setAddOns, setUsageLimits, setFeatureLimits, setError, setLoading } = useSubscriptionFeatureStore();

  return useQuery({
    queryKey: ['subscription', 'all'],
    queryFn: async () => {
      setLoading(true);
      const [plans, subscription, addOns, usageLimits] = await Promise.all([
        subscriptionRepository.getPlans(),
        subscriptionRepository.getCurrentSubscription(),
        subscriptionRepository.getAddOns(),
        subscriptionRepository.getUsageLimits(),
      ]);
      setPlans(plans);
      setSubscription(subscription);
      setAddOns(addOns);
      setUsageLimits(usageLimits);
      setError(null);
      return { plans, subscription, addOns, usageLimits };
    },
    staleTime: SUBSCRIPTION_CONSTANTS.CACHE.SUBSCRIPTION_STALE_TIME,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useRefreshSubscription() {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['subscription'] }),
      queryClient.invalidateQueries({ queryKey: ['settings', 'subscriptionPlans'] }),
      queryClient.invalidateQueries({ queryKey: ['settings', 'userSubscription'] }),
      queryClient.invalidateQueries({ queryKey: ['settings', 'addOns'] }),
      queryClient.invalidateQueries({ queryKey: ['settings', 'usageLimits'] }),
    ]);
  };
}
