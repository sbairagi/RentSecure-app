import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { unitsRepository } from '../repository/unitsRepository';
import type { SubscriptionLimits } from '../types/units';

const SUBSCRIPTION_LIMITS_QUERY_KEY = ['units', 'subscription-limits'];

export const useUnitSubscriptionLimits = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<SubscriptionLimits>({
    queryKey: SUBSCRIPTION_LIMITS_QUERY_KEY,
    queryFn: () => unitsRepository.fetchSubscriptionLimits(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_LIMITS_QUERY_KEY });
  }, [queryClient]);

  return {
    limits: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
