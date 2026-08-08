import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionRepository } from '../repository';
import { useRefreshSubscription } from './useSubscription';
import { useRefreshAddOns } from './useAddOns';
import { useRefreshUsageLimits } from './useUsageLimits';
import { useRefreshEffectiveLimits } from './useEffectiveLimits';

export function usePurchaseAddOn() {
  const queryClient = useQueryClient();
  const refresh = useRefreshSubscription();
  const refreshAddOns = useRefreshAddOns();
  const refreshLimits = useRefreshUsageLimits();
  const refreshEffective = useRefreshEffectiveLimits();

  return useMutation({
    mutationFn: subscriptionRepository.purchaseAddOn,
    onSuccess: () => {
      refreshAddOns();
      refreshLimits();
      refreshEffective();
      refresh();
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export function useDeleteAddOn() {
  const queryClient = useQueryClient();
  const refresh = useRefreshSubscription();
  const refreshAddOns = useRefreshAddOns();
  const refreshLimits = useRefreshUsageLimits();
  const refreshEffective = useRefreshEffectiveLimits();

  return useMutation({
    mutationFn: subscriptionRepository.deleteAddOn,
    onSuccess: () => {
      refreshAddOns();
      refreshLimits();
      refreshEffective();
      refresh();
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  const refresh = useRefreshSubscription();

  return useMutation({
    mutationFn: subscriptionRepository.createOrUpdateSubscription,
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const refresh = useRefreshSubscription();

  return useMutation({
    mutationFn: subscriptionRepository.deleteSubscription,
    onSuccess: () => {
      refresh();
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}
