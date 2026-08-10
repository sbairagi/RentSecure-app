import { queryClient } from '@/providers/queryClient';
import { offlineQueue } from '../queue/offlineQueue';
import { offlineStorage } from '../storage/offlineStorage';
import { networkManager } from '@/services/api/networkManager';
import { logger } from '@/services/api/logger';
import type { SyncResult, SyncStatus } from '../types';
import { SYNC_STATUS } from '../constants';

export type SyncState = {
  status: SyncStatus;
  lastSyncTimestamp: number | null;
  lastSyncStatus: string | null;
  pendingCount: number;
  conflictCount: number;
  error: string | null;
};

export type SyncActions = {
  sync: () => Promise<SyncResult>;
  cancel: () => void;
  clearConflicts: () => Promise<void>;
  clearFailed: () => Promise<void>;
  reset: () => void;
};

export type SyncManager = SyncState & SyncActions;

let isSyncing = false;
let cancelRequested = false;

export const syncManager: SyncManager = {
  status: SYNC_STATUS.IDLE,
  lastSyncTimestamp: null,
  lastSyncStatus: null,
  pendingCount: 0,
  conflictCount: 0,
  error: null,

  async sync(): Promise<SyncResult> {
    if (isSyncing) {
      return { total: 0, succeeded: 0, failed: 0, conflicts: 0, skipped: 0 };
    }

    const isConnected = await networkManager.isConnected();
    if (!isConnected) {
      logger.warn('Sync attempted while offline');
      return { total: 0, succeeded: 0, failed: 0, conflicts: 0, skipped: 0 };
    }

    isSyncing = true;
    cancelRequested = false;

    syncManager.status = SYNC_STATUS.SYNCING;
    syncManager.error = null;

    const result: SyncResult = {
      total: 0,
      succeeded: 0,
      failed: 0,
      conflicts: 0,
      skipped: 0,
    };

    try {
      await offlineQueue.load();
      const pendingItems = offlineQueue.getPendingItems();
      result.total = pendingItems.length;

      if (pendingItems.length === 0) {
        syncManager.status = SYNC_STATUS.SUCCESS;
        syncManager.lastSyncTimestamp = Date.now();
        syncManager.lastSyncStatus = 'success';
        syncManager.pendingCount = 0;
        syncManager.conflictCount = offlineQueue.getConflicts().length;
        await offlineStorage.setLastSyncTimestamp(Date.now());
        await offlineStorage.setLastSyncStatus('success');
        return result;
      }

      for (const _item of pendingItems) {
        if (cancelRequested) {
          logger.info('Sync cancelled by user');
          break;
        }

        try {
          await offlineQueue.processQueue();
          const remaining = offlineQueue.getPendingItems();
          result.succeeded = result.total - remaining.length;
          result.conflicts = offlineQueue.getConflicts().length;
        } catch (itemError) {
          result.failed += 1;
          logger.warn('Sync item failed', { error: (itemError as Error).message });
        }
      }

      await queryClient.invalidateQueries();

      syncManager.lastSyncTimestamp = Date.now();
      syncManager.pendingCount = offlineQueue.getPendingCount();
      syncManager.conflictCount = offlineQueue.getConflicts().length;

      if (result.failed === 0 && result.conflicts === 0) {
        syncManager.status = SYNC_STATUS.SUCCESS;
        syncManager.lastSyncStatus = 'success';
        await offlineStorage.setLastSyncTimestamp(Date.now());
        await offlineStorage.setLastSyncStatus('success');
      } else if (result.conflicts > 0) {
        syncManager.status = SYNC_STATUS.CONFLICT;
        syncManager.lastSyncStatus = 'conflict';
        await offlineStorage.setLastSyncStatus('conflict');
      } else {
        syncManager.status = SYNC_STATUS.FAILED;
        syncManager.lastSyncStatus = 'failed';
        syncManager.error = `${result.failed} operations failed to sync`;
        await offlineStorage.setLastSyncStatus('failed');
      }
    } catch (error) {
      logger.error('Sync failed', error as Error);
      syncManager.status = SYNC_STATUS.FAILED;
      syncManager.lastSyncStatus = 'failed';
      syncManager.error = (error as Error).message;
      await offlineStorage.setLastSyncStatus('failed');
    } finally {
      isSyncing = false;
      cancelRequested = false;
    }

    return result;
  },

  cancel(): void {
    cancelRequested = true;
    logger.info('Sync cancellation requested');
  },

  async clearConflicts(): Promise<void> {
    await offlineQueue.clearSuccessful();
    syncManager.conflictCount = offlineQueue.getConflicts().length;
  },

  async clearFailed(): Promise<void> {
    await offlineQueue.clearFailed();
    syncManager.pendingCount = offlineQueue.getPendingCount();
  },

  reset(): void {
    syncManager.status = SYNC_STATUS.IDLE;
    syncManager.error = null;
  },
};

export async function initializeSync(): Promise<void> {
  try {
    await offlineQueue.load();

    const lastSyncStatus = await offlineStorage.getLastSyncStatus();
    if (lastSyncStatus === 'failed' || lastSyncStatus === 'conflict') {
      syncManager.lastSyncStatus = lastSyncStatus;
      syncManager.status = lastSyncStatus === 'conflict' ? SYNC_STATUS.CONFLICT : SYNC_STATUS.FAILED;
    }

    const lastSyncTimestamp = await offlineStorage.getLastSyncTimestamp();
    if (lastSyncTimestamp) {
      syncManager.lastSyncTimestamp = lastSyncTimestamp;
    }

    syncManager.pendingCount = offlineQueue.getPendingCount();
    syncManager.conflictCount = offlineQueue.getConflicts().length;

    const { useAuthStore } = await import('@/store/authStore');
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      await offlineStorage.clearUserData(userId);
    }

    logger.debug('Sync manager initialized', {
      pendingCount: syncManager.pendingCount,
      conflictCount: syncManager.conflictCount,
      lastSyncStatus,
    });
  } catch (error) {
    logger.error('Failed to initialize sync', error as Error);
  }
}

export async function performSync(): Promise<SyncResult> {
  return syncManager.sync();
}
