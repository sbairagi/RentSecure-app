import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { Renter } from '../types/renters';

const RENTER_PROFILE_QUERY_KEY = (id: number | string) => ['renters', 'profile', id];

export const useRenterProfile = (id: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Renter>({
    queryKey: RENTER_PROFILE_QUERY_KEY(id),
    queryFn: () => rentersRepository.fetchRenter(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_PROFILE_QUERY_KEY(id) });
  }, [id, queryClient]);

  return {
    profile: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
