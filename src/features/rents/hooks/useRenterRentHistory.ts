import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentsRepository } from '../repository/rentsRepository';
import { useRentsStore } from '../store/rentsStore';

const RENTER_HISTORY_QUERY_KEY = ['rents', 'renter', 'history'];

export const useRenterRentHistory = () => {
  const queryClient = useQueryClient();
  const { setError } = useRentsStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: RENTER_HISTORY_QUERY_KEY,
    queryFn: () => rentsRepository.fetchRenterHistory(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_HISTORY_QUERY_KEY });
  }, [queryClient]);

  return {
    history: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    refetch,
  };
};
