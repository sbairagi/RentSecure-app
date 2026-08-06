import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import { useRentersStore } from '../store/rentersStore';
import type { RenterFilters, RenterListResponse } from '../types/renters';

const RENTERS_QUERY_KEY = (params?: RenterFilters) => ['renters', 'list', params];

export const useRenters = (params?: RenterFilters) => {
  const queryClient = useQueryClient();
  const { setRenters, setError, cacheRenters } = useRentersStore();

  const { data, isLoading, isFetching, error } = useQuery<RenterListResponse>({
    queryKey: RENTERS_QUERY_KEY(params),
    queryFn: () => rentersRepository.fetchRenters(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      cacheRenters(data);
      const list = Array.isArray(data) ? data : data.results || [];
      setRenters(list);
    }
  }, [data, setRenters, cacheRenters]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to load renters');
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTERS_QUERY_KEY(params) });
  }, [params, queryClient]);

  const renters = useRentersStore((state) => state.renters);

  return {
    renters,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: Array.isArray(data) ? data.length : data?.count || 0,
  };
};
