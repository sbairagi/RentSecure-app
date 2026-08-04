import { mmkvStorage } from '@/services/storage/mmkv';
import { API_CONFIG } from './endpoints';
import { logger } from './logger';
import { networkManager } from './networkManager';
import type { QueuedRequest } from './types';

class RequestQueue {
  private queue: QueuedRequest[] = [];
  private isProcessing = false;
  private maxRetries = 3;

  async enqueue(request: Omit<QueuedRequest, 'id' | 'createdAt' | 'retryCount'>): Promise<string> {
    const queuedRequest: QueuedRequest = {
      ...request,
      id: this.generateId(),
      createdAt: Date.now(),
      retryCount: 0,
    };

    this.queue.push(queuedRequest);
    await this.persistQueue();

    logger.debug('Request queued', { url: request.url, queueSize: this.queue.length });

    if (await networkManager.isConnected()) {
      this.processQueue();
    }

    return queuedRequest.id;
  }

  async dequeue(id: string): Promise<QueuedRequest | undefined> {
    const index = this.queue.findIndex((req) => req.id === id);
    if (index === -1) return undefined;

    const [request] = this.queue.splice(index, 1);
    await this.persistQueue();
    return request;
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    const isConnected = await networkManager.isConnected();
    if (!isConnected) {
      logger.debug('Cannot process queue - offline');
      return;
    }

    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const isConnectedNow = await networkManager.isConnected();
        if (!isConnectedNow) break;

        const request = this.queue[0];
        if (!request) break;

        try {
          await this.executeRequest(request);
          this.queue.shift();
          await this.persistQueue();
          logger.debug('Queued request executed', { url: request.url });
        } catch (error) {
          request.retryCount += 1;
          logger.warn('Queued request failed', {
            url: request.url,
            retryCount: request.retryCount,
            error: (error as Error).message,
          });

          if (request.retryCount >= this.maxRetries) {
            this.queue.shift();
            await this.persistQueue();
            logger.error('Queued request max retries exceeded', { url: request.url });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 2000 * request.retryCount));
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getQueue(): QueuedRequest[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
    this.persistQueue();
  }

  async loadPersistedQueue(): Promise<void> {
    try {
      const persisted = await mmkvStorage.getItem(API_CONFIG.QUEUE_STORAGE_KEY);
      if (persisted) {
        this.queue = JSON.parse(persisted);
        logger.debug('Loaded persisted queue', { size: this.queue.length });
      }
    } catch (error) {
      logger.error('Failed to load persisted queue', error as Error);
      this.queue = [];
    }
  }

  private async persistQueue(): Promise<void> {
    try {
      await mmkvStorage.setItem(API_CONFIG.QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logger.error('Failed to persist queue', error as Error);
    }
  }

  private generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private async executeRequest(request: QueuedRequest): Promise<any> {
    const { apiClient } = await import('./apiClient');

    const axiosInstance = apiClient.getAxiosInstance();

    switch (request.method) {
      case 'GET':
        return axiosInstance.get(request.url, { params: request.params });
      case 'POST':
        return axiosInstance.post(request.url, request.data, { params: request.params });
      case 'PUT':
        return axiosInstance.put(request.url, request.data, { params: request.params });
      case 'PATCH':
        return axiosInstance.patch(request.url, request.data, { params: request.params });
      case 'DELETE':
        return axiosInstance.delete(request.url, { params: request.params });
      default:
        throw new Error(`Unsupported method: ${request.method}`);
    }
  }
}

export const requestQueue = new RequestQueue();
