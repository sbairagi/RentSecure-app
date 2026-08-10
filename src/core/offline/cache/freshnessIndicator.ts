import React, { useState } from 'react';
import type { CacheFreshness } from '../types';
import { getFreshnessLabel, getFreshnessColor, getFreshnessLevel, getCachePolicy } from './cacheStrategy';
import { useIsOnline } from '../network/useNetworkStatus';
import { offlineStorage } from '../storage/offlineStorage';

export function useCacheFreshness(resource: string): {
  freshness: CacheFreshness;
  label: string;
  color: string;
  timestamp: number | null;
  isStale: boolean;
  isAvailable: boolean;
} {
  const isOnline = useIsOnline();
  const policy = getCachePolicy(resource);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  React.useEffect(() => {
    let mounted = true;
    offlineStorage.getResourceTimestamp(resource).then((ts) => {
      if (mounted) setTimestamp(ts);
    });
    return () => {
      mounted = false;
    };
  }, [resource]);

  const freshness = getFreshnessLevel(timestamp, policy, isOnline);
  const label = getFreshnessLabel(freshness);
  const color = getFreshnessColor(freshness);
  const isStale = freshness === 'stale' || freshness === 'offline-cached';
  const isAvailable = freshness !== 'unavailable';

  return { freshness, label, color, timestamp, isStale, isAvailable };
}

export function formatLastSynced(timestamp: number | null): string {
  if (!timestamp) return 'Never synced';

  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  return new Date(timestamp).toLocaleDateString();
}

export function getSyncStatusText(status: string, pendingCount: number): string {
  switch (status) {
    case 'syncing':
      return 'Syncing...';
    case 'success':
      return 'All data is up to date.';
    case 'failed':
      return 'Sync failed. Tap to retry.';
    case 'conflict':
      return 'Sync conflict. Review changes.';
    case 'idle':
    default:
      return pendingCount > 0 ? `${pendingCount} pending change${pendingCount > 1 ? 's' : ''}` : '';
  }
}


