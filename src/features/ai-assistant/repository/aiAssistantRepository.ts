import { apiService } from '@/services/api/apiClient';
import type {
  AIChatRequest,
  AIChatResponse,
  SuggestedQuestionsResponse,
  ConversationsResponse,
  ConversationDetail,
  CreateConversationRequest,
  PaginatedConversations,
} from '../types';

export const aiAssistantRepository = {
  sendMessage: async (
    request: AIChatRequest
  ): Promise<AIChatResponse> => {
    return apiService.post<AIChatResponse>(
      '/api/ai-assistant/chat/',
      request
    );
  },

  getSuggestedQuestions: async (): Promise<SuggestedQuestionsResponse> => {
    return apiService.get<SuggestedQuestionsResponse>(
      '/api/ai-assistant/suggested-questions/'
    );
  },

  getConversations: async (
    page = 1,
    limit = 20
  ): Promise<PaginatedConversations> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return apiService.get<PaginatedConversations>(
      `/api/ai-assistant/conversations/?${params.toString()}`
    );
  },

  getConversation: async (
    id: string
  ): Promise<ConversationDetail> => {
    return apiService.get<ConversationDetail>(
      `/api/ai-assistant/conversations/${id}/`
    );
  },

  createConversation: async (
    request: CreateConversationRequest = {}
  ): Promise<ConversationDetail> => {
    return apiService.post<ConversationDetail>(
      '/api/ai-assistant/conversations/',
      request
    );
  },

  deleteConversation: async (id: string): Promise<void> => {
    await apiService.delete(`/api/ai-assistant/conversations/${id}/`);
  },

  getInsights: async (): Promise<Record<string, any>> => {
    return apiService.get<Record<string, any>>('/api/ai-assistant/insights/');
  },
};
