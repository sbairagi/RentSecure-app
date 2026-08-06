import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { RenterDocument } from '../types/renters';

const RENTER_DOCUMENTS_QUERY_KEY = (renterId: number | string) => [
  'renters',
  renterId,
  'documents',
];

export const useRenterDocuments = (renterId: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RenterDocument[]>({
    queryKey: RENTER_DOCUMENTS_QUERY_KEY(renterId),
    queryFn: () => rentersRepository.fetchDocuments(renterId),
    enabled: !!renterId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_DOCUMENTS_QUERY_KEY(renterId) });
  }, [renterId, queryClient]);

  return {
    documents: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
