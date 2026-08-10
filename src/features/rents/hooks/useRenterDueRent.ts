import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentsRepository } from '../repository/rentsRepository';
import { useRentsStore } from '../store/rentsStore';

const RENTER_DUE_QUERY_KEY = ['rents', 'renter', 'due'];

export const useRenterDueRent = () => {
  const queryClient = useQueryClient();
  const { setRenterDueRent, setError } = useRentsStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: RENTER_DUE_QUERY_KEY,
    queryFn: () => rentsRepository.fetchRenterDueRent(),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_DUE_QUERY_KEY });
  }, [queryClient]);

  return {
    dueRent: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    refetch,
  };
};
