import { mmkvStorage } from '@/services/storage/mmkv';
import { logger } from '@/services/api/logger';

const OFFLINE_STORAGE_KEYS = {
  LAST_SYNC_TIMESTAMP: 'offline_last_sync_timestamp',
  PENDING_QUEUE_COUNT: 'offline_pending_queue_count',
  LAST_SYNC_STATUS: 'offline_last_sync_status',
  CACHED_DASHBOARD_TIMESTAMP: 'offline_cached_dashboard_timestamp',
  CACHED_BUILDINGS_TIMESTAMP: 'offline_cached_buildings_timestamp',
  CACHED_UNITS_TIMESTAMP: 'offline_cached_units_timestamp',
  CACHED_RENTERS_TIMESTAMP: 'offline_cached_renters_timestamp',
  CACHED_CARETAKERS_TIMESTAMP: 'offline_cached_caretakers_timestamp',
  CACHED_MAINTENANCE_TIMESTAMP: 'offline_cached_maintenance_timestamp',
  CACHED_NOTIFICATIONS_TIMESTAMP: 'offline_cached_notifications_timestamp',
  CACHED_RENT_RECORDS_TIMESTAMP: 'offline_cached_rent_records_timestamp',
  CACHED_VISITORS_TIMESTAMP: 'offline_cached_visitors_timestamp',
  CACHED_PAYMENTS_TIMESTAMP: 'offline_cached_payments_timestamp',
  CACHED_AGREEMENTS_TIMESTAMP: 'offline_cached_agreements_timestamp',
  CACHED_DOCUMENTS_TIMESTAMP: 'offline_cached_documents_timestamp',
  CACHED_SUBSCRIPTIONS_TIMESTAMP: 'offline_cached_subscriptions_timestamp',
  USER_SPECIFIC_PREFIX: 'offline_user_',
} as const;

export class OfflineStorage {
  async getLastSyncTimestamp(): Promise<number | null> {
    try {
      const value = await mmkvStorage.getItem(OFFLINE_STORAGE_KEYS.LAST_SYNC_TIMESTAMP);
      return value ? parseInt(value, 10) : null;
    } catch (error) {
      logger.error('Failed to get last sync timestamp', error as Error);
      return null;
    }
  }

  async setLastSyncTimestamp(timestamp: number): Promise<void> {
    try {
      await mmkvStorage.setItem(OFFLINE_STORAGE_KEYS.LAST_SYNC_TIMESTAMP, String(timestamp));
    } catch (error) {
      logger.error('Failed to set last sync timestamp', error as Error);
    }
  }

  async getLastSyncStatus(): Promise<string | null> {
    try {
      return await mmkvStorage.getItem(OFFLINE_STORAGE_KEYS.LAST_SYNC_STATUS);
    } catch (error) {
      logger.error('Failed to get last sync status', error as Error);
      return null;
    }
  }

  async setLastSyncStatus(status: string): Promise<void> {
    try {
      await mmkvStorage.setItem(OFFLINE_STORAGE_KEYS.LAST_SYNC_STATUS, status);
    } catch (error) {
      logger.error('Failed to set last sync status', error as Error);
    }
  }

  async getPendingQueueCount(): Promise<number> {
    try {
      const value = await mmkvStorage.getItem(OFFLINE_STORAGE_KEYS.PENDING_QUEUE_COUNT);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      logger.error('Failed to get pending queue count', error as Error);
      return 0;
    }
  }

  async setPendingQueueCount(count: number): Promise<void> {
    try {
      await mmkvStorage.setItem(OFFLINE_STORAGE_KEYS.PENDING_QUEUE_COUNT, String(count));
    } catch (error) {
      logger.error('Failed to set pending queue count', error as Error);
    }
  }

  async getResourceTimestamp(resource: string): Promise<number | null> {
    try {
      const key = this.getResourceKey(resource);
      const value = await mmkvStorage.getItem(key);
      return value ? parseInt(value, 10) : null;
    } catch (error) {
      logger.error('Failed to get resource timestamp', { resource, error: error as Error });
      return null;
    }
  }

  async setResourceTimestamp(resource: string, timestamp: number): Promise<void> {
    try {
      const key = this.getResourceKey(resource);
      await mmkvStorage.setItem(key, String(timestamp));
    } catch (error) {
      logger.error('Failed to set resource timestamp', { resource, error: error as Error });
    }
  }

  async getUserScopedKey(baseKey: string, userId: string | number): Promise<string> {
    return `${OFFLINE_STORAGE_KEYS.USER_SPECIFIC_PREFIX}${userId}_${baseKey}`;
  }

  async clearUserData(userId: string | number): Promise<void> {
    try {
      const prefix = `${OFFLINE_STORAGE_KEYS.USER_SPECIFIC_PREFIX}${userId}_`;
      const keysToRemove = Object.values(OFFLINE_STORAGE_KEYS).filter((key) =>
        key.startsWith(prefix)
      ) as string[];
      for (const key of keysToRemove) {
        await mmkvStorage.removeItem(key);
      }
      logger.debug('Cleared user-specific offline data', { userId });
    } catch (error) {
      logger.error('Failed to clear user data', { userId, error: error as Error });
    }
  }

  async clearAll(): Promise<void> {
    try {
      const keysToRemove = Object.values(OFFLINE_STORAGE_KEYS).filter((key) =>
        key.startsWith('offline_')
      ) as string[];
      for (const key of keysToRemove) {
        await mmkvStorage.removeItem(key);
      }
      logger.debug('Cleared all offline data');
    } catch (error) {
      logger.error('Failed to clear all offline data', error as Error);
    }
  }

  private getResourceKey(resource: string): string {
    const normalized = resource.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const key = `offline_cached_${normalized}_timestamp`;
    return OFFLINE_STORAGE_KEYS[key as keyof typeof OFFLINE_STORAGE_KEYS] || key;
  }
}

export const offlineStorage = new OfflineStorage();
export { OFFLINE_STORAGE_KEYS };
