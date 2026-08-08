import { useQuery } from '@tanstack/react-query';
import { aiAssistantService } from '../services';
import { AI_ASSISTANT_CONSTANTS } from '../constants';

export function useAICapabilities() {
  const insightsQuery = useQuery({
    queryKey: ['ai-assistant', 'insights'],
    queryFn: async () => {
      return aiAssistantService.loadInsights();
    },
    staleTime: AI_ASSISTANT_CONSTANTS.CACHE.SUGGESTED_QUESTIONS_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    enabled: false,
  });

  return {
    insights: insightsQuery.data,
    isLoadingInsights: insightsQuery.isLoading,
    refetchInsights: insightsQuery.refetch,
  };
}
