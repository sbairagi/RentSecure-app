import { useEffect, useRef, useCallback } from 'react';
import { networkManager } from '@/services/api/networkManager';
import { syncManager, initializeSync, performSync } from './syncEngine';

export function useSyncManager() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initializeSync().catch((error) => {
        console.error('Failed to initialize sync manager:', error);
      });
    }
  }, []);

  const handleNetworkChange = useCallback(async (status: string) => {
    if (status === 'online') {
      const lastSyncStatus = syncManager.lastSyncStatus;
      if (lastSyncStatus === 'failed' || lastSyncStatus === 'conflict') {
        performSync().catch((error) => {
          console.error('Auto-sync failed:', error);
        });
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = networkManager.subscribe(handleNetworkChange);
    return () => unsubscribe();
  }, [handleNetworkChange]);

  const sync = useCallback(async () => {
    return performSync();
  }, []);

  return {
    status: syncManager.status,
    lastSyncTimestamp: syncManager.lastSyncTimestamp,
    lastSyncStatus: syncManager.lastSyncStatus,
    pendingCount: syncManager.pendingCount,
    conflictCount: syncManager.conflictCount,
    error: syncManager.error,
    sync,
    cancel: syncManager.cancel,
    clearConflicts: syncManager.clearConflicts,
    clearFailed: syncManager.clearFailed,
    reset: syncManager.reset,
  };
}
