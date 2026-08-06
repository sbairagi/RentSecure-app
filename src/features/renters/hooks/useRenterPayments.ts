import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { RentRecord } from '../types/renters';

const RENTER_PAYMENTS_QUERY_KEY = (renterId: number | string) => ['renters', renterId, 'payments'];

export const useRenterPayments = (renterId: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RentRecord[]>({
    queryKey: RENTER_PAYMENTS_QUERY_KEY(renterId),
    queryFn: async () => rentersRepository.fetchRentRecords(renterId),
    enabled: !!renterId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_PAYMENTS_QUERY_KEY(renterId) });
  }, [renterId, queryClient]);

  return {
    payments: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
