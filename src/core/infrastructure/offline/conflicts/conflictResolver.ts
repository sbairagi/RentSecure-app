import type { ConflictInfo } from '../types';
import { logger } from '@/services/api/logger';

export type ResolutionStrategy = 'keep-server' | 'keep-local' | 'retry' | 'manual';

export interface ConflictResolutionResult {
  strategy: ResolutionStrategy;
  resolved: boolean;
  data?: Record<string, any>;
  message: string;
}

export async function resolveConflict(
  conflict: ConflictInfo,
  strategy: ResolutionStrategy,
  mergeData?: Record<string, any>
): Promise<ConflictResolutionResult> {
  logger.info('Resolving conflict', {
    resource: conflict.resource,
    strategy,
  });

  switch (strategy) {
    case 'keep-server':
      return {
        strategy: 'keep-server',
        resolved: true,
        data: conflict.serverVersion,
        message: 'Server version kept',
      };

    case 'keep-local':
      return {
        strategy: 'keep-local',
        resolved: true,
        data: conflict.localVersion,
        message: 'Local changes kept. Will retry on next sync.',
      };

    case 'retry':
      return {
        strategy: 'retry',
        resolved: false,
        data: mergeData || conflict.localVersion,
        message: 'Retrying with merged data',
      };

    case 'manual':
      return {
        strategy: 'manual',
        resolved: false,
        data: conflict.serverVersion,
        message: 'Manual review required',
      };

    default:
      return {
        strategy: 'keep-server',
        resolved: true,
        data: conflict.serverVersion,
        message: 'Default: server version kept',
      };
  }
}

export function getConflictResolution(
  conflict: ConflictInfo
): ResolutionStrategy {
  if (!conflict.localUpdatedAt || !conflict.serverUpdatedAt) {
    return 'keep-server';
  }

  const localTime = new Date(conflict.localUpdatedAt).getTime();
  const serverTime = new Date(conflict.serverUpdatedAt).getTime();

  if (isNaN(localTime) || isNaN(serverTime)) {
    return 'keep-server';
  }

  const timeDiff = serverTime - localTime;
  const oneHour = 60 * 60 * 1000;

  if (timeDiff > oneHour) {
    return 'keep-server';
  }

  if (timeDiff < -oneHour) {
    return 'keep-local';
  }

  const { conflictingFields } = compareVersionsSimple(
    conflict.localVersion,
    conflict.serverVersion
  );

  if (conflictingFields.length === 0) {
    return 'keep-server';
  }

  if (conflictingFields.length <= 2) {
    return 'retry';
  }

  return 'manual';
}

export function getResolutionDescription(strategy: ResolutionStrategy): string {
  switch (strategy) {
    case 'keep-server':
      return 'Keep the server version. Your local changes will be discarded.';
    case 'keep-local':
      return 'Keep your local changes. The server version will be overwritten on next sync.';
    case 'retry':
      return 'Retry with a merge of both versions. Some fields may still need manual review.';
    case 'manual':
      return 'Review both versions and choose which changes to keep.';
    default:
      return 'Unknown resolution strategy.';
  }
}

function compareVersionsSimple(
  local: Record<string, any>,
  server: Record<string, any>
): { conflictingFields: string[] } {
  const conflictingFields: string[] = [];

  for (const key of Object.keys(local)) {
    if (key in server && JSON.stringify(local[key]) !== JSON.stringify(server[key])) {
      conflictingFields.push(key);
    }
  }

  return { conflictingFields };
}
