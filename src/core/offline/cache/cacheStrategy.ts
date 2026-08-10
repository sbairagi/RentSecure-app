import type { CachePolicy, CacheFreshness } from '../types';
import { DEFAULT_CACHE_POLICIES } from '../constants';

export function getCachePolicy(resource: string): CachePolicy {
  const normalized = resource.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return DEFAULT_CACHE_POLICIES[normalized] || {
    staleTime: 5 * 60_000,
    cacheTime: 10 * 60_000,
    freshnessLevel: 'stale',
    requiresAuth: true,
    financialSensitive: false,
  };
}

export function getFreshnessLevel(
  timestamp: number | null,
  policy: CachePolicy,
  isOnline: boolean
): CacheFreshness {
  if (!timestamp) {
    return 'unavailable';
  }

  const age = Date.now() - timestamp;

  if (age > policy.cacheTime) {
    return 'unavailable';
  }

  if (!isOnline) {
    return 'offline-cached';
  }

  if (age <= policy.staleTime) {
    return 'fresh';
  }

  return 'stale';
}

export function getFreshnessLabel(level: CacheFreshness): string {
  switch (level) {
    case 'fresh':
      return 'Up to date';
    case 'stale':
      return 'Data may be outdated';
    case 'offline-cached':
      return 'Showing cached data';
    case 'unavailable':
      return 'No cached data available';
    default:
      return '';
  }
}

export function getFreshnessColor(level: CacheFreshness): string {
  switch (level) {
    case 'fresh':
      return '#166534';
    case 'stale':
      return '#92400e';
    case 'offline-cached':
      return '#1e40af';
    case 'unavailable':
      return '#991b1b';
    default:
      return '#64748b';
  }
}

export function shouldShowStaleWarning(level: CacheFreshness): boolean {
  return level === 'stale' || level === 'offline-cached';
}

export function isCacheExpired(timestamp: number | null, policy: CachePolicy): boolean {
  if (!timestamp) return true;
  return Date.now() - timestamp > policy.cacheTime;
}

export function isCacheStale(timestamp: number | null, policy: CachePolicy): boolean {
  if (!timestamp) return true;
  return Date.now() - timestamp > policy.staleTime;
}
