import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import { queryKeys } from '@/providers/queryClient';
import type { RenterStatusSummary } from '../types/renters';

export const useRenterStatusSummary = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RenterStatusSummary>({
    queryKey: queryKeys.renters.statusSummary,
    queryFn: () => rentersRepository.fetchStatusSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.renters.statusSummary });
  }, [queryClient]);

  return {
    summary: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};