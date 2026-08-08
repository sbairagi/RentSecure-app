import { useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionRepository } from '../repository';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';
import { SUBSCRIPTION_CONSTANTS } from '../constants';
import { subscriptionService } from '../services/subscriptionService';

export function useCurrentSubscription() {
  return useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: async () => {
      const subscription = await subscriptionRepository.getCurrentSubscription();
      useSubscriptionFeatureStore.getState().setSubscription(subscription);
      return subscription;
    },
    staleTime: SUBSCRIPTION_CONSTANTS.CACHE.SUBSCRIPTION_STALE_TIME,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useSubscriptionStatus() {
  const { data: subscription } = useCurrentSubscription();
  const status = subscriptionService.getStatus(subscription ?? null);
  const daysRemaining = subscriptionService.getDaysRemaining(subscription ?? null);
  const isExpired = subscriptionService.isExpired(subscription ?? null);
  const isInGrace = subscriptionService.isInGracePeriod(subscription ?? null);

  return {
    subscription,
    status,
    daysRemaining,
    isExpired,
    isInGracePeriod: isInGrace,
    isActive: status.isActive,
    planName: status.planName,
  };
}

export function useRefreshCurrentSubscription() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['subscription', 'current'] });
}
