import { useQuery } from '@tanstack/react-query';
import { agreementsRepository } from '../repository/agreementsRepository';
import type { AgreementDocument } from '../types/agreements';

export const useAgreementDocuments = (agreementId: number | string) => {
  const { data, isLoading, error, refetch } = useQuery<AgreementDocument[]>({
    queryKey: ['agreements', 'documents', agreementId],
    queryFn: () => agreementsRepository.fetchDocuments(agreementId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!agreementId,
  });

  return {
    documents: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
