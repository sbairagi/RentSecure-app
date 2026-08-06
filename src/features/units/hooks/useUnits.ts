import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { unitsRepository } from '../repository/unitsRepository';
import { useUnitsStore } from '../store/unitsStore';
import type { UnitFilters, UnitListResponse } from '../types/units';

const UNITS_QUERY_KEY = (params?: UnitFilters) => ['units', 'list', params];

export const useUnits = (params?: UnitFilters) => {
  const queryClient = useQueryClient();
  const { setUnits, setError, cacheUnits } = useUnitsStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery<UnitListResponse>({
    queryKey: UNITS_QUERY_KEY(params),
    queryFn: () => unitsRepository.fetchUnits(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      cacheUnits(data);
      const list = Array.isArray(data) ? data : data.results || [];
      setUnits(list);
    }
  }, [data, setUnits, cacheUnits]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to load units');
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY(params) });
  }, [params, queryClient]);

  const units = useUnitsStore((state) => state.units);

  return {
    units,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: Array.isArray(data) ? data.length : data?.count || 0,
  };
};
