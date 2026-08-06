import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { agreementsRepository } from '../repository/agreementsRepository';
import type { Agreement } from '../types/agreements';

const AGREEMENT_QUERY_KEY = (id: number | string) => ['agreements', 'detail', id];

export const useAgreement = (id: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<Agreement>({
    queryKey: AGREEMENT_QUERY_KEY(id),
    queryFn: () => agreementsRepository.fetchAgreement(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!id,
  });

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    agreement: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
