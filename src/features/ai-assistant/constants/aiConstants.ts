export const AI_ASSISTANT_CONSTANTS = {
  API: {
    CHAT: '/api/ai-assistant/chat/',
    CONVERSATIONS: '/api/ai-assistant/conversations/',
    CONVERSATION_DETAIL: (id: string) => `/api/ai-assistant/conversations/${id}/`,
    DELETE_CONVERSATION: (id: string) => `/api/ai-assistant/conversations/${id}/`,
    SUGGESTED_QUESTIONS: '/api/ai-assistant/suggested-questions/',
    INSIGHTS: '/api/ai-assistant/insights/',
  } as const,
  CACHE: {
    SUGGESTED_QUESTIONS_STALE_TIME: 5 * 60 * 1000, // 5 minutes
    CONVERSATIONS_STALE_TIME: 2 * 60 * 1000, // 2 minutes
  },
  LIMITS: {
    MAX_MESSAGE_LENGTH: 2000,
    MAX_CONVERSATIONS: 50,
    MAX_MESSAGES_PER_CONVERSATION: 100,
    TYPING_INDICATOR_DELAY: 500,
  },
  RETRY: {
    MAX_RETRIES: 2,
    RETRY_DELAY: 1000,
  },
} as const;

export const AI_ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'Please log in to use AI Assistant.',
  forbidden: 'You do not have permission to access AI Assistant.',
  not_found: 'AI Assistant is currently unavailable.',
  rate_limit_exceeded: 'You have reached your monthly AI limit. Please upgrade your plan.',
  subscription_expired: 'Your subscription has expired. Please renew to continue.',
  insufficient_data: 'I could not retrieve the information you requested. Please try again later.',
  provider_failure: 'AI service is temporarily unavailable. Please try again.',
  tool_failure: 'Unable to process your request. Please try again.',
  timeout: 'Request timed out. Please try again.',
  network_error: 'No internet connection. Please check your network.',
  unknown: 'An unexpected error occurred. Please try again.',
};

export const AI_SUGGESTED_QUESTIONS = [
  'How much rent is pending this month?',
  'Which renters have overdue rent?',
  'Which units are vacant?',
  'Which agreements are expiring soon?',
  'How much rent was collected this month?',
  'Which maintenance requests are still open?',
  'Which buildings have the highest occupancy?',
  'How many active renters do I have?',
  'What is my payout status?',
  'Show me my subscription details.',
] as const;
