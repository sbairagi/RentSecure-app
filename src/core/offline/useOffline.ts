import { useMemo } from 'react';
import { useNetworkStatus, useIsOnline, useIsOffline } from './network/useNetworkStatus';
import { useSyncManager } from './sync/useSyncManager';
import { offlineQueue } from './queue/offlineQueue';
import { classifyOperation, isOfflineSafe, requiresNetwork } from './utils/classification';
import { validateFinancialOperation, getFinancialDisclaimer } from './utils/financialSafety';
import { formatLastSynced, getSyncStatusText } from './cache/freshnessIndicator';
import type { NetworkState, OperationCategory, OfflineQueueItem } from './types';

export interface UseOfflineResult {
  networkStatus: NetworkState;
  isOnline: boolean;
  isOffline: boolean;
  syncStatus: string;
  lastSyncTimestamp: number | null;
  lastSyncFormatted: string;
  pendingCount: number;
  conflictCount: number;
  hasPendingItems: boolean;
  sync: () => Promise<any>;
  cancel: () => void;
  clearConflicts: () => Promise<void>;
  clearFailed: () => Promise<void>;
  classify: (method: string, endpoint: string) => { category: OperationCategory; reason: string };
  canQueue: (category: OperationCategory) => boolean;
  requiresNetwork: (category: OperationCategory) => boolean;
  validateFinancial: (category: OperationCategory) => { allowed: boolean; reason?: string };
  getDisclaimer: () => string;
  getPendingItems: () => OfflineQueueItem[];
  getConflicts: () => OfflineQueueItem[];
}

export function useOffline(): UseOfflineResult {
  const networkStatus = useNetworkStatus();
  const isOnline = useIsOnline();
  const isOffline = useIsOffline();
  const sync = useSyncManager();

  const lastSyncFormatted = useMemo(
    () => formatLastSynced(sync.lastSyncTimestamp),
    [sync.lastSyncTimestamp]
  );

  const syncStatusText = useMemo(
    () => getSyncStatusText(sync.status, sync.pendingCount),
    [sync.status, sync.pendingCount]
  );

  const classify = useMemo(
    () => (method: string, endpoint: string) => classifyOperation(method, endpoint),
    []
  );

  const canQueue = useMemo(
    () => (category: OperationCategory) => isOfflineSafe(category),
    []
  );

  const requiresNet = useMemo(
    () => (category: OperationCategory) => requiresNetwork(category),
    []
  );

  const validateFinancial = useMemo(
    () => (category: OperationCategory) => validateFinancialOperation(category, isOnline),
    [isOnline]
  );

  const getDisclaimer = useMemo(() => getFinancialDisclaimer, []);

  const getPendingItems = useMemo(() => () => offlineQueue.getPendingItems(), []);
  const getConflicts = useMemo(() => () => offlineQueue.getConflicts(), []);

  return {
    networkStatus,
    isOnline,
    isOffline,
    syncStatus: syncStatusText,
    lastSyncTimestamp: sync.lastSyncTimestamp,
    lastSyncFormatted,
    pendingCount: sync.pendingCount,
    conflictCount: sync.conflictCount,
    hasPendingItems: offlineQueue.hasPendingItems(),
    sync: sync.sync,
    cancel: sync.cancel,
    clearConflicts: sync.clearConflicts,
    clearFailed: sync.clearFailed,
    classify,
    canQueue,
    requiresNetwork: requiresNet,
    validateFinancial,
    getDisclaimer,
    getPendingItems,
    getConflicts,
  };
}
