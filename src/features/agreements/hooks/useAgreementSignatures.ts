import { useQuery } from '@tanstack/react-query';
import { agreementsRepository } from '../repository/agreementsRepository';
import type { AgreementWitness } from '../types/agreements';

export const useAgreementSignatures = (agreementId: number | string) => {
  const { data, isLoading, error, refetch } = useQuery<AgreementWitness[]>({
    queryKey: ['agreements', 'witnesses', agreementId],
    queryFn: () => agreementsRepository.fetchWitnesses(agreementId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!agreementId,
  });

  return {
    signatures: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
