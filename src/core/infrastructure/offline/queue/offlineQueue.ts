import { mmkvStorage } from '@/services/storage/mmkv';
import { logger } from '@/services/api/logger';
import { networkManager } from '@/services/api/networkManager';
import type { OfflineQueueItem } from '../types';
import { MAX_QUEUE_RETRIES } from '../constants';
import { classifyOperation, isOfflineSafe, isReadOnlyCacheable, requiresNetwork } from '../utils/classification';

const OFFLINE_QUEUE_STORAGE_KEY = 'offline_mutation_queue';

class OfflineQueue {
  private queue: OfflineQueueItem[] = [];
  private isProcessing = false;
  private listeners: Set<(items: OfflineQueueItem[]) => void> = new Set();

  async load(): Promise<void> {
    try {
      const persisted = await mmkvStorage.getItem(OFFLINE_QUEUE_STORAGE_KEY);
      if (persisted) {
        this.queue = JSON.parse(persisted) as OfflineQueueItem[];
        this.notifyListeners();
      }
    } catch (error) {
      logger.error('Failed to load offline queue', error as Error);
      this.queue = [];
    }
  }

  async enqueue(item: Omit<OfflineQueueItem, 'id' | 'createdAt' | 'retryCount' | 'status'>): Promise<string> {
    const classification = classifyOperation(item.method, item.endpoint);

    if (requiresNetwork(classification.category)) {
      throw new Error(`Operation ${item.method} ${item.endpoint} requires network and cannot be queued offline.`);
    }

    if (!isOfflineSafe(classification.category) && !isReadOnlyCacheable(classification.category)) {
      throw new Error(`Operation ${item.method} ${item.endpoint} is not safe for offline queuing.`);
    }

    const queueItem: OfflineQueueItem = {
      ...item,
      category: classification.category,
      id: this.generateId(),
      createdAt: Date.now(),
      retryCount: 0,
      status: 'pending',
    };

    this.queue.push(queueItem);
    await this.persist();
    this.notifyListeners();

    logger.debug('Offline queue item enqueued', {
      id: queueItem.id,
      operation: queueItem.operation,
      resource: queueItem.resource,
      category: queueItem.category,
    });

    if (await networkManager.isConnected()) {
      this.processQueue();
    }

    return queueItem.id;
  }

  async dequeue(id: string): Promise<OfflineQueueItem | undefined> {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    const [item] = this.queue.splice(index, 1);
    await this.persist();
    this.notifyListeners();
    return item;
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    const isConnected = await networkManager.isConnected();
    if (!isConnected) {
      logger.debug('Cannot process offline queue - offline');
      return;
    }

    this.isProcessing = true;

    try {
      const pendingItems = this.queue.filter((item) => item.status === 'pending' || item.status === 'failed');
      logger.debug('Processing offline queue', { count: pendingItems.length });

      for (const item of pendingItems) {
        const stillConnected = await networkManager.isConnected();
        if (!stillConnected) {
          logger.debug('Network lost during queue processing');
          break;
        }

        await this.processItem(item);
      }
    } finally {
      this.isProcessing = false;
      this.notifyListeners();
    }
  }

  async markAsSuccess(id: string, serverResourceId?: string | number): Promise<void> {
    const item = this.queue.find((i) => i.id === id);
    if (item) {
      item.status = 'success';
      item.serverResourceId = serverResourceId;
      await this.persist();
      this.notifyListeners();
      logger.debug('Queue item marked as success', { id, serverResourceId });
    }
  }

  async markAsFailed(id: string, error: string): Promise<void> {
    const item = this.queue.find((i) => i.id === id);
    if (item) {
      item.retryCount += 1;
      item.lastError = error;

      if (item.retryCount >= MAX_QUEUE_RETRIES) {
        item.status = 'failed';
        logger.warn('Queue item permanently failed', { id, error });
      } else {
        item.status = 'pending';
        logger.warn('Queue item failed, will retry', { id, retryCount: item.retryCount });
      }

      await this.persist();
      this.notifyListeners();
    }
  }

  async markAsConflict(id: string, _serverVersion: Record<string, any>): Promise<void> {
    const item = this.queue.find((i) => i.id === id);
    if (item) {
      item.status = 'conflict';
      await this.persist();
      this.notifyListeners();
      logger.warn('Queue item marked as conflict', { id });
    }
  }

  getPendingItems(): OfflineQueueItem[] {
    return this.queue.filter((item) => item.status === 'pending' || item.status === 'failed');
  }

  getConflicts(): OfflineQueueItem[] {
    return this.queue.filter((item) => item.status === 'conflict');
  }

  getQueue(): OfflineQueueItem[] {
    return [...this.queue];
  }

  getPendingCount(): number {
    return this.queue.filter((item) => item.status === 'pending').length;
  }

  hasPendingItems(): boolean {
    return this.getPendingCount() > 0;
  }

  clear(): Promise<void> {
    this.queue = [];
    this.persist();
    this.notifyListeners();
    return Promise.resolve();
  }

  clearSuccessful(): Promise<void> {
    this.queue = this.queue.filter((item) => item.status !== 'success');
    this.persist();
    this.notifyListeners();
    return Promise.resolve();
  }

  clearFailed(): Promise<void> {
    this.queue = this.queue.filter((item) => item.status !== 'failed');
    this.persist();
    this.notifyListeners();
    return Promise.resolve();
  }

  subscribe(listener: (items: OfflineQueueItem[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private async processItem(item: OfflineQueueItem): Promise<void> {
    item.status = 'syncing';
    await this.persist();
    this.notifyListeners();

    try {
      const { apiClient } = await import('@/services/api/apiClient');
      const axiosInstance = apiClient.getAxiosInstance();

      const response = await axiosInstance.request({
        url: item.endpoint,
        method: item.method,
        data: item.payload,
        headers: item.payload._headers,
      });

      const serverResourceId = response.data?.id || response.data?.data?.id;
      await this.markAsSuccess(item.id, serverResourceId);

      if (item.originalUpdatedAt && response.data?.updated_at) {
        if (new Date(response.data.updated_at).getTime() > new Date(item.originalUpdatedAt).getTime()) {
          await this.markAsConflict(item.id, response.data);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error';
      await this.markAsFailed(item.id, errorMessage);

      if (error?.response?.status === 409) {
        await this.markAsConflict(item.id, error.response.data || {});
      }
    }
  }

  private async persist(): Promise<void> {
    try {
      await mmkvStorage.setItem(OFFLINE_QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logger.error('Failed to persist offline queue', error as Error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener([...this.queue]);
      } catch (error) {
        logger.error('Offline queue listener error', error as Error);
      }
    });
  }

  private generateId(): string {
    return `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const offlineQueue = new OfflineQueue();
