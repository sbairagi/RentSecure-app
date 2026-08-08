import type { Conversation, Message } from './ai';

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface CreateConversationRequest {
  title?: string;
}

export interface PaginatedConversations {
  conversations: ConversationSummary[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
