import { useQuery } from '@tanstack/react-query';
import { agreementsRepository } from '../repository/agreementsRepository';
import type { AgreementStatusSummary } from '../types/agreements';

export const useAgreementStatusSummary = () => {
  const { data, isLoading, error, refetch } = useQuery<AgreementStatusSummary>({
    queryKey: ['agreements', 'status_summary'],
    queryFn: () => agreementsRepository.fetchStatusSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  return {
    summary: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
