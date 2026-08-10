import type { OperationCategory, OperationClassification } from '../types';
import { OPERATION_CLASSIFICATIONS, ONLINE_ONLY_CATEGORIES, OFFLINE_SAFE_CATEGORIES } from '../constants';

export function classifyOperation(
  method: string,
  endpoint: string
): OperationClassification {
  const normalizedMethod = method.toUpperCase();
  const normalizedEndpoint = normalizeEndpoint(endpoint);

  const directKey = `${normalizedMethod} ${normalizedEndpoint}`;
  if (OPERATION_CLASSIFICATIONS[directKey]) {
    return {
      category: OPERATION_CLASSIFICATIONS[directKey],
      reason: `Direct match: ${directKey}`,
    };
  }

  const wildcardKey = `${normalizedMethod} /*`;
  if (OPERATION_CLASSIFICATIONS[wildcardKey]) {
    return {
      category: OPERATION_CLASSIFICATIONS[wildcardKey],
      reason: `Wildcard match: ${wildcardKey}`,
    };
  }

  if (normalizedMethod === 'GET') {
    return {
      category: 'read-only-cacheable',
      reason: 'Default: GET requests are cacheable unless explicitly classified',
    };
  }

  return {
    category: 'online-only',
    reason: 'Default: mutations require online unless explicitly classified as offline-safe',
  };
}

export function isOfflineSafe(category: OperationCategory): boolean {
  return OFFLINE_SAFE_CATEGORIES.includes(category);
}

export function isOnlineOnly(category: OperationCategory): boolean {
  return ONLINE_ONLY_CATEGORIES.includes(category);
}

export function isReadOnlyCacheable(category: OperationCategory): boolean {
  return category === 'read-only-cacheable';
}

export function isSensitiveFinancial(category: OperationCategory): boolean {
  return category === 'sensitive-financial';
}

export function canQueueOffline(category: OperationCategory): boolean {
  return isOfflineSafe(category) || isReadOnlyCacheable(category);
}

export function requiresNetwork(category: OperationCategory): boolean {
  return isOnlineOnly(category) || isSensitiveFinancial(category);
}

function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return '';

  const withoutQuery = endpoint.split('?')[0];
  const withoutLeadingSlash = withoutQuery.replace(/^\/+/, '');
  const withoutTrailingSlash = withoutLeadingSlash.replace(/\/+$/, '');

  if (withoutTrailingSlash.includes('/')) {
    const parts = withoutTrailingSlash.split('/');
    const lastPart = parts[parts.length - 1];
    if (/^\d+$/.test(lastPart)) {
      parts[parts.length - 1] = '{id}';
      return parts.join('/');
    }
  }

  return withoutTrailingSlash;
}

export function getOfflineSafeResources(): string[] {
  return Object.entries(OPERATION_CLASSIFICATIONS)
    .filter(([, category]) => isOfflineSafe(category))
    .map(([key]) => key);
}

export function getOnlineOnlyResources(): string[] {
  return Object.entries(OPERATION_CLASSIFICATIONS)
    .filter(([, category]) => isOnlineOnly(category) || isSensitiveFinancial(category))
    .map(([key]) => key);
}
