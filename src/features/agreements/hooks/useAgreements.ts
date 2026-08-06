import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { agreementsRepository } from '../repository/agreementsRepository';
import { useAgreementsStore } from '../store/agreementsStore';
import type { AgreementFilters, AgreementListResponse } from '../types/agreements';

const AGREEMENTS_QUERY_KEY = (params?: AgreementFilters) => ['agreements', 'list', params];

export const useAgreements = (params?: AgreementFilters) => {
  const queryClient = useQueryClient();
  const { setAgreements, setError, cacheAgreements } = useAgreementsStore();

  const { data, isLoading, isFetching, error } = useQuery<AgreementListResponse>({
    queryKey: AGREEMENTS_QUERY_KEY(params),
    queryFn: () => agreementsRepository.fetchAgreements(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      cacheAgreements(data);
      const list = Array.isArray(data) ? data : data.results || [];
      setAgreements(list);
    }
  }, [data, setAgreements, cacheAgreements]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to load agreements');
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: AGREEMENTS_QUERY_KEY(params) });
  }, [params, queryClient]);

  const agreements = useAgreementsStore((state) => state.agreements);

  return {
    agreements,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: Array.isArray(data) ? data.length : data?.count || 0,
  };
};
