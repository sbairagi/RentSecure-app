import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentsRepository } from '../repository/rentsRepository';
import { useRentsStore } from '../store/rentsStore';
import type { RentRecord } from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';

const RENT_DETAIL_QUERY_KEY = (id: number | string) => ['rents', 'detail', id];

export const useRentRecordDetail = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setSelectedRent, setError } = useRentsStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RentRecord>({
    queryKey: RENT_DETAIL_QUERY_KEY(id),
    queryFn: () => rentsRepository.fetchRentRecord(id),
    enabled: !!id,
    staleTime: RENT_CONSTANTS.CACHE.STALE_TIME,
    gcTime: RENT_CONSTANTS.CACHE.GC_TIME,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENT_DETAIL_QUERY_KEY(id) });
  }, [id, queryClient]);

  return {
    rent: data || null,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    refetch,
  };
};
