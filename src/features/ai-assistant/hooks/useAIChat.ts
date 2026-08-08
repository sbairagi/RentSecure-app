import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAssistantService } from '../services';
import { useAIAssistantStore } from '../store';
import { showMessage } from 'react-native-flash-message';

export function useAIChat() {
  const queryClient = useQueryClient();
  const {
    addMessage,
    updateMessage,
    setLoading,
    setTyping,
    setProcessing,
    setError,
    clearError,
    setCurrentConversationId,
    currentConversationId,
    isTyping,
    error,
    errorCode,
  } = useAIAssistantStore();

  const chatMutation = useMutation({
    mutationFn: async ({
      message,
      conversationId,
    }: {
      message: string;
      conversationId?: string | null;
    }) => {
      clearError();
      setLoading(true);
      setProcessing(true);

      const userMessage = {
        id: `user-${Date.now()}`,
        conversation_id: conversationId || `conv-${Date.now()}`,
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString(),
      };

      addMessage(userMessage);

      const tempAssistantId = `assistant-${Date.now()}`;
      const assistantMessage = {
        id: tempAssistantId,
        conversation_id: userMessage.conversation_id,
        role: 'assistant' as const,
        content: '',
        timestamp: new Date().toISOString(),
        is_error: false,
      };
      addMessage(assistantMessage);
      setTyping(true);

      try {
        const result = await aiAssistantService.sendMessage(
          message,
          conversationId || undefined
        );

        setCurrentConversationId(result.conversationId);
        setTyping(false);
        setProcessing(false);
        setLoading(false);

        updateMessage(tempAssistantId, {
          content: result.response.response,
          tools_used: result.response.tools_used,
          data: result.response.data,
          sources: result.response.sources,
          timestamp: result.response.timestamp,
          is_error: result.response.is_error || false,
          error_code: result.response.error_code || null,
        });

        queryClient.invalidateQueries({
          queryKey: ['ai-assistant', 'conversations'],
        });

        return {
          userMessage,
          assistantMessage: {
            ...assistantMessage,
            content: result.response.response,
            tools_used: result.response.tools_used,
            data: result.response.data,
            sources: result.response.sources,
          },
          conversationId: result.conversationId,
        };
      } catch (error: any) {
        setTyping(false);
        setProcessing(false);
        setLoading(false);

        const errorCode = error?.error_code || error?.code || 'unknown';
        const errorMessage =
          error?.message || 'Failed to send message. Please try again.';

        updateMessage(tempAssistantId, {
          content: errorMessage,
          is_error: true,
          error_code: errorCode,
        });

        setError(errorMessage, errorCode);

        showMessage({
          message: errorMessage,
          type: 'danger',
        });

        throw error;
      }
    },
  });

  const retryMutation = useMutation({
    mutationFn: async ({
      message,
      conversationId,
    }: {
      message: string;
      conversationId: string;
    }) => {
      return chatMutation.mutateAsync({ message, conversationId });
    },
  });

  return {
    sendMessage: chatMutation.mutateAsync,
    sendMessageAsync: chatMutation.mutate,
    retryMessage: retryMutation.mutateAsync,
    isLoading: chatMutation.isPending,
    isTyping,
    error,
    errorCode,
    currentConversationId,
  };
}
