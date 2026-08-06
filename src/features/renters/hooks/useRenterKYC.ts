import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { rentersRepository } from '../repository/rentersRepository';
import type { KycDocument } from '../types/renters';

const KYC_DOCUMENTS_QUERY_KEY = (renterId: number | string) => [
  'renters',
  renterId,
  'kyc-documents',
];

export const useRenterKYC = (renterId: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<KycDocument[]>({
    queryKey: KYC_DOCUMENTS_QUERY_KEY(renterId),
    queryFn: () => rentersRepository.fetchKycDocuments(renterId),
    enabled: !!renterId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: KYC_DOCUMENTS_QUERY_KEY(renterId) });
  }, [renterId, queryClient]);

  return {
    kycDocuments: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};
