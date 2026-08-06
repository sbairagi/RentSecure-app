import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { RenterStatusSummary } from '../types/renters';

const RENTER_STATUS_SUMMARY_QUERY_KEY = ['renters', 'status-summary'];

export const useRenterStatusSummary = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RenterStatusSummary>({
    queryKey: RENTER_STATUS_SUMMARY_QUERY_KEY,
    queryFn: () => rentersRepository.fetchStatusSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_STATUS_SUMMARY_QUERY_KEY });
  }, [queryClient]);

  return {
    summary: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
