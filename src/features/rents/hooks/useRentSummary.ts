import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentsRepository } from '../repository/rentsRepository';
import { useRentsStore } from '../store/rentsStore';

const RENT_SUMMARY_QUERY_KEY = ['rents', 'summary'];

export const useRentSummary = () => {
  const { setError } = useRentsStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: RENT_SUMMARY_QUERY_KEY,
    queryFn: () => rentsRepository.fetchMonthlySummary(),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENT_SUMMARY_QUERY_KEY });
  }, []);

  return {
    summary: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    refetch,
  };
};
