export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tools_used?: string[];
  data?: Record<string, any>;
  sources?: string[];
  is_error?: boolean;
  error_code?: string;
  retry_count?: number;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message?: Message;
}

export interface AIChatRequest {
  message: string;
  conversation_id?: string | null;
  context?: Record<string, any>;
}

export interface AIChatResponse {
  conversation_id: string;
  response: string;
  tools_used: string[];
  data: Record<string, any>;
  sources: string[];
  timestamp: string;
  is_error?: boolean;
  error_code?: string;
  message?: string;
}

export interface SuggestedQuestionsResponse {
  questions: string[];
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface AIError {
  error: string;
  message: string;
  retry_after?: number;
}

export type AIErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'rate_limit_exceeded'
  | 'subscription_expired'
  | 'insufficient_data'
  | 'provider_failure'
  | 'tool_failure'
  | 'timeout'
  | 'network_error'
  | 'unknown';

export interface AIState {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  isProcessing: boolean;
  error: string | null;
  errorCode: AIErrorCode | null;
  suggestedQuestions: string[];
  hasMoreMessages: boolean;
}
