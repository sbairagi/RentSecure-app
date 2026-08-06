import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { unitsRepository } from '../repository/unitsRepository';
import type { UnitAnalytics } from '../types/units';

const UNIT_ANALYTICS_QUERY_KEY = ['units', 'analytics'];

export const useUnitAnalytics = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<UnitAnalytics>({
    queryKey: UNIT_ANALYTICS_QUERY_KEY,
    queryFn: () => unitsRepository.fetchAnalytics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: UNIT_ANALYTICS_QUERY_KEY });
  }, [queryClient]);

  return {
    analytics: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
