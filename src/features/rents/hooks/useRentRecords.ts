import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentsRepository } from '../repository/rentsRepository';
import { useRentsStore } from '../store/rentsStore';
import type { RentFilters, RentListResponse } from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';

const RENT_RECORDS_QUERY_KEY = (params?: RentFilters) => ['rents', 'list', params];

export const useRentRecords = (params?: RentFilters) => {
  const queryClient = useQueryClient();
  const { setRentRecords, setError } = useRentsStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RentListResponse>({
    queryKey: RENT_RECORDS_QUERY_KEY(params),
    queryFn: () => rentsRepository.fetchRentRecords(params),
    staleTime: RENT_CONSTANTS.CACHE.STALE_TIME,
    gcTime: RENT_CONSTANTS.CACHE.GC_TIME,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENT_RECORDS_QUERY_KEY(params) });
  }, [params, queryClient]);

  const rentRecords = useRentsStore((state) => state.rentRecords);

  return {
    rentRecords: rentRecords.length > 0 ? rentRecords : data?.results || [],
    data,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: data?.count || 0,
    refetch,
  };
};
