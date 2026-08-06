import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { RenterAgreement } from '../types/renters';

const RENTER_AGREEMENTS_QUERY_KEY = (renterId: number | string) => [
  'renters',
  renterId,
  'agreements',
];

export const useRenterAgreements = (renterId: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RenterAgreement[]>({
    queryKey: RENTER_AGREEMENTS_QUERY_KEY(renterId),
    queryFn: () => rentersRepository.fetchAgreements(renterId),
    enabled: !!renterId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_AGREEMENTS_QUERY_KEY(renterId) });
  }, [renterId, queryClient]);

  return {
    agreements: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
