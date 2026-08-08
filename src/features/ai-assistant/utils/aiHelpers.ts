export function generateConversationTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim();
  if (cleaned.length <= 30) return cleaned;
  return `${cleaned.slice(0, 27)}...`;
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function formatFullTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString();
}

export function getAIErrorUserMessage(errorCode: string | null): string {
  const messages: Record<string, string> = {
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
  };
  return messages[errorCode || 'unknown'] || messages.unknown;
}

export function isRetryableError(errorCode: string | null): boolean {
  if (!errorCode) return false;
  const retryableCodes = [
    'timeout',
    'network_error',
    'provider_failure',
    'tool_failure',
  ];
  return retryableCodes.includes(errorCode);
}

export function sanitizeMessageContent(content: string): string {
  return content.trim().slice(0, 2000);
}

export function shouldShowUpgradePrompt(errorCode: string | null): boolean {
  return errorCode === 'rate_limit_exceeded' || errorCode === 'subscription_expired';
}
