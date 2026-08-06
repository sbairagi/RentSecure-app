import { useQuery } from '@tanstack/react-query';
import { agreementsRepository } from '../repository/agreementsRepository';
import type { AgreementTimelineEntry } from '../types/agreements';

export const useAgreementTimeline = (agreementId: number | string) => {
  const { data, isLoading, error, refetch } = useQuery<AgreementTimelineEntry[]>({
    queryKey: ['agreements', 'timeline', agreementId],
    queryFn: () => agreementsRepository.fetchTimeline(agreementId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!agreementId,
  });

  return {
    timeline: data || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
