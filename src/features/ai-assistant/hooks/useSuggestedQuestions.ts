import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aiAssistantService } from '../services';
import { useAIAssistantStore } from '../store';
import { AI_ASSISTANT_CONSTANTS } from '../constants';

export function useSuggestedQuestions() {
  return useQuery({
    queryKey: ['ai-assistant', 'suggested-questions'],
    queryFn: async () => {
      const questions = await aiAssistantService.loadSuggestedQuestions();
      useAIAssistantStore.getState().setSuggestedQuestions(questions);
      return questions;
    },
    staleTime: AI_ASSISTANT_CONSTANTS.CACHE.SUGGESTED_QUESTIONS_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
}
