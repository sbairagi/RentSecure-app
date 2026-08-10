import { queryClient } from '@/providers/queryClient';
import { apiCache } from '@/services/api/cache';
import { logger } from '@/services/api/logger';
import { offlineStorage } from '../storage/offlineStorage';

export async function invalidateQueries(queryKey: string[]): Promise<void> {
  try {
    await queryClient.invalidateQueries({ queryKey });
    logger.debug('Queries invalidated', { queryKey });
  } catch (error) {
    logger.error('Failed to invalidate queries', { queryKey, error });
  }
}

export async function invalidateResource(resource: string): Promise<void> {
  const invalidationMap: Record<string, string[][]> = {
    buildings: [['buildings', 'list']],
    units: [['units', 'list']],
    renters: [['renters', 'list']],
    caretakers: [['caretakers', 'list']],
    maintenance: [['dashboard', 'activity']],
    notifications: [
      ['notifications', 'list'],
      ['notifications', 'unread'],
    ],
    rentRecords: [['dashboard', 'activity']],
    payments: [['payments', 'list']],
    agreements: [['agreements', 'list']],
    visitors: [['property', 'list']],
    dashboard: [['dashboard', 'stats'], ['dashboard', 'activity']],
    subscriptions: [
      ['subscriptions', 'current'],
      ['subscriptions', 'plans'],
    ],
  };

  const normalizedResource = resource.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const queryKeysToInvalidate = invalidationMap[normalizedResource];

  if (queryKeysToInvalidate) {
    await Promise.all(
      queryKeysToInvalidate.map((key) => invalidateQueries(key))
    );
  }

  apiCache.invalidate(resource);
  await offlineStorage.setResourceTimestamp(resource, Date.now());

  logger.debug('Resource invalidated', { resource });
}

export async function invalidateOnMutation(
  resource: string,
  action: 'create' | 'update' | 'delete'
): Promise<void> {
  await invalidateResource(resource);

  if (action === 'create' || action === 'update') {
    await invalidateResource('dashboard');
  }

  if (resource === 'buildings') {
    await invalidateResource('units');
  }

  if (resource === 'units') {
    await invalidateResource('renters');
    await invalidateResource('rentRecords');
  }

  if (resource === 'renters') {
    await invalidateResource('rentRecords');
  }
}

export async function clearAllCache(): Promise<void> {
  try {
    queryClient.clear();
    apiCache.clear();
    await offlineStorage.clearAll();
    logger.debug('All cache cleared');
  } catch (error) {
    logger.error('Failed to clear all cache', error as Error);
  }
}
