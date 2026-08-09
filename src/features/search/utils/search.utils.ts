import type { SearchResourceType, SearchResult } from '../types/search.types';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 10) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes === 1) return '1m ago';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours === 1) return '1h ago';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks === 1) return '1w ago';
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths === 1) return '1mo ago';
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  
  return date.toLocaleDateString();
}

export function getResourceTypeColor(type: SearchResourceType): string {
  return SEARCH_CONSTANTS.RESOURCE_TYPES[type]?.color || '#6B7280';
}

export function getResourceTypeIcon(type: SearchResourceType): string {
  return SEARCH_CONSTANTS.RESOURCE_TYPES[type]?.icon || '📄';
}

export function getResourceTypeLabel(type: SearchResourceType): string {
  return SEARCH_CONSTANTS.RESOURCE_TYPES[type]?.label || type;
}

const NAVIGATION_MAP: Record<SearchResourceType, { route: string; hasDetail: boolean }> = {
  buildings: { route: '/(drawer)/(tabs)/buildings/[id]', hasDetail: true },
  units: { route: '/(drawer)/(tabs)/units/[id]', hasDetail: true },
  renters: { route: '/(drawer)/(tabs)/renters/[id]', hasDetail: true },
  caretakers: { route: '/(drawer)/(tabs)/caretakers/[id]', hasDetail: true },
  rent_records: { route: '/(drawer)/(tabs)/payments', hasDetail: false },
  visitors: { route: '/(drawer)/(tabs)/visitors/[id]', hasDetail: true },
  agreements: { route: '/(drawer)/(tabs)/agreements', hasDetail: false },
};

export function buildNavigationTarget(result: SearchResult): string {
  const mapping = NAVIGATION_MAP[result.resource_type];
  if (!mapping || !mapping.hasDetail) {
    return mapping?.route || '';
  }
  return `${mapping.route.replace('[id]', String(result.id))}`;
}

export function isDeepLinkAvailable(result: SearchResult): boolean {
  const mapping = NAVIGATION_MAP[result.resource_type];
  return mapping ? mapping.hasDetail : false;
}

export function getResourceTypeBadgeStyle(type: SearchResourceType): { color: string; backgroundColor: string } {
  const color = getResourceTypeColor(type);
  const backgroundColor = `${color}15`;
  return { color, backgroundColor };
}
