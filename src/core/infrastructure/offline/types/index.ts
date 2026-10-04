export type NetworkState = 'online' | 'offline' | 'reconnecting' | 'unknown';

export type OperationCategory =
  | 'read-only-cacheable'
  | 'offline-safe-mutation'
  | 'online-only'
  | 'sensitive-financial';

export type QueueStatus = 'pending' | 'syncing' | 'success' | 'failed' | 'conflict';

export type CacheFreshness = 'fresh' | 'stale' | 'offline-cached' | 'unavailable';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'failed' | 'conflict';

export interface OfflineQueueItem {
  id: string;
  operation: string;
  resource: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: Record<string, any>;
  category: OperationCategory;
  createdAt: number;
  retryCount: number;
  status: QueueStatus;
  lastError?: string;
  serverResourceId?: string | number;
  originalUpdatedAt?: string;
}

export interface SyncResult {
  total: number;
  succeeded: number;
  failed: number;
  conflicts: number;
  skipped: number;
}

export interface ConflictInfo {
  queueItemId: string;
  resource: string;
  serverVersion: Record<string, any>;
  localVersion: Record<string, any>;
  serverUpdatedAt?: string;
  localUpdatedAt?: string;
}

export type OperationClassification = {
  category: OperationCategory;
  reason: string;
};

export interface CachePolicy {
  staleTime: number;
  cacheTime: number;
  freshnessLevel: CacheFreshness;
  requiresAuth: boolean;
  financialSensitive: boolean;
}
