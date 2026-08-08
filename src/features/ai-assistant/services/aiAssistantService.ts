import { aiAssistantRepository } from '../repository';
import { useAIAssistantStore } from '../store';
import { AI_ASSISTANT_CONSTANTS } from '../constants';
import { sanitizeMessageContent, generateConversationTitle } from '../utils';
import { showMessage } from 'react-native-flash-message';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AI_QUERY_KEY = ['ai-assistant'];

export class AIAssistantService {
  async sendMessage(
    message: string,
    conversationId?: string | null
  ): Promise<{
    response: any;
    conversationId: string;
  }> {
    const sanitized = sanitizeMessageContent(message);
    const response = await aiAssistantRepository.sendMessage({
      message: sanitized,
      conversation_id: conversationId || null,
    });

    return {
      response,
      conversationId: response.conversation_id,
    };
  }

  async loadSuggestedQuestions(): Promise<string[]> {
    try {
      const response = await aiAssistantRepository.getSuggestedQuestions();
      return response.questions || [];
    } catch (error) {
      return [];
    }
  }

  async loadConversations(page = 1, limit = 20): Promise<any> {
    return aiAssistantRepository.getConversations(page, limit);
  }

  async createConversation(title?: string): Promise<any> {
    return aiAssistantRepository.createConversation({ title });
  }

  async deleteConversation(id: string): Promise<void> {
    await aiAssistantRepository.deleteConversation(id);
  }

  async loadInsights(): Promise<Record<string, any>> {
    return aiAssistantRepository.getInsights();
  }
}

export const aiAssistantService = new AIAssistantService();
