import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { RenterActivity } from '../types/renters';

const RENTER_ACTIVITY_QUERY_KEY = (renterId: number | string) => ['renters', renterId, 'activity'];

export const useRenterActivity = (renterId: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RenterActivity[]>({
    queryKey: RENTER_ACTIVITY_QUERY_KEY(renterId),
    queryFn: async () => rentersRepository.fetchRecentActivity(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_ACTIVITY_QUERY_KEY(renterId) });
  }, [renterId, queryClient]);

  return {
    activity: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
