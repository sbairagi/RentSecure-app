import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAssistantService } from '../services';
import { useAIAssistantStore } from '../store';
import { showMessage } from 'react-native-flash-message';
import { AI_ASSISTANT_CONSTANTS } from '../constants';

export function useConversations() {
  const queryClient = useQueryClient();
  const { removeConversation } = useAIAssistantStore();

  const conversationsQuery = useQuery({
    queryKey: ['ai-assistant', 'conversations'],
    queryFn: async () => {
      const result = await aiAssistantService.loadConversations(1, 20);
      useAIAssistantStore.getState().setConversations(result.conversations || []);
      return result;
    },
    staleTime: AI_ASSISTANT_CONSTANTS.CACHE.CONVERSATIONS_STALE_TIME,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await aiAssistantService.deleteConversation(id);
    },
    onSuccess: (_, id) => {
      removeConversation(id);
      queryClient.invalidateQueries({ queryKey: ['ai-assistant', 'conversations'] });
      showMessage({
        message: 'Conversation deleted',
        type: 'success',
      });
    },
    onError: () => {
      showMessage({
        message: 'Failed to delete conversation',
        type: 'danger',
      });
    },
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['ai-assistant', 'conversations'],
    });
  }, [queryClient]);

  return {
    conversations: conversationsQuery.data?.conversations || [],
    isLoading: conversationsQuery.isLoading,
    isFetching: conversationsQuery.isFetching,
    error: conversationsQuery.error?.message || null,
    deleteConversation: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    refresh,
  };
}
