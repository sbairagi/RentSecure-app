import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentsRepository } from '../repository/rentsRepository';
import { useRentsStore } from '../store/rentsStore';
import type { RentRecord } from '../types/rents';

const RENTER_RECORDS_QUERY_KEY = (params?: { page?: number; limit?: number }) =>
  ['rents', 'renter', 'records', params];

export const useRenterRentRecords = (params?: { page?: number; limit?: number }) => {
  const queryClient = useQueryClient();
  const { setRentRecords, setError } = useRentsStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: RENTER_RECORDS_QUERY_KEY(params),
    queryFn: () => rentsRepository.fetchRenterRecords(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_RECORDS_QUERY_KEY(params) });
  }, [params, queryClient]);

  return {
    records: data?.data || [],
    meta: data?.meta,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    refetch,
  };
};
