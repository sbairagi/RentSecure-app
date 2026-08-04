import { queryClient } from '@/providers/queryClient';
import { mmkvStorage } from '@/services/storage/mmkv';
import { logger } from './logger';
import type { CacheEntry } from './types';

export class ApiCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private defaultStaleTime: number = 5 * 60 * 1000;
  private defaultCacheTime: number = 10 * 60 * 1000;

  set<T>(key: string, data: T, staleTime?: number, cacheTime?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      staleTime: staleTime || this.defaultStaleTime,
      cacheTime: cacheTime || this.defaultCacheTime,
    };

    this.memoryCache.set(key, entry);

    try {
      const serialized = JSON.stringify(entry);
      mmkvStorage.setItem(`cache_${key}`, serialized);
    } catch (error) {
      logger.warn('Failed to persist cache', { key, error });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.memoryCache.get(key);

    if (!entry) {
      try {
        const persisted = await mmkvStorage.getItem(`cache_${key}`);
        if (persisted) {
          const parsed = JSON.parse(persisted) as CacheEntry<T>;
          if (Date.now() - parsed.timestamp < parsed.cacheTime) {
            this.memoryCache.set(key, parsed);
            return parsed.data;
          }
          mmkvStorage.removeItem(`cache_${key}`);
        }
      } catch {
        return null;
      }
      return null;
    }

    if (Date.now() - entry.timestamp > entry.cacheTime) {
      this.memoryCache.delete(key);
      mmkvStorage.removeItem(`cache_${key}`);
      return null;
    }

    return entry.data;
  }

  isStale(key: string): boolean {
    const entry = this.memoryCache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > entry.staleTime;
  }

  invalidate(key?: string): void {
    if (key) {
      this.memoryCache.delete(key);
      mmkvStorage.removeItem(`cache_${key}`);
      logger.debug('Cache invalidated', { key });
    } else {
      this.memoryCache.clear();
      logger.debug('All cache invalidated');
    }
  }

  refresh(key: string): void {
    const entry = this.memoryCache.get(key);
    if (entry) {
      entry.timestamp = Date.now();
      this.memoryCache.set(key, entry);
    }
  }

  async refreshQueries(queryKey: string[]): Promise<void> {
    try {
      await queryClient.invalidateQueries({ queryKey });
    } catch (error) {
      logger.error('Failed to refresh queries', { queryKey, error });
    }
  }

  prefetch<T>(key: string, fetcher: () => Promise<T>, staleTime?: number): Promise<T | null> {
    return new Promise((resolve) => {
      const cached = this.get<T>(key);
      if (cached && !this.isStale(key)) {
        resolve(cached);
        return;
      }

      fetcher()
        .then((data) => {
          this.set(key, data, staleTime);
          resolve(data);
        })
        .catch((error) => {
          logger.error('Prefetch failed', { key, error: (error as Error).message });
          resolve(null);
        });
    });
  }

  clear(): void {
    this.memoryCache.clear();
    logger.debug('In-memory cache cleared');
  }

  getMemorySize(): number {
    return this.memoryCache.size;
  }
}

export const apiCache = new ApiCache();
