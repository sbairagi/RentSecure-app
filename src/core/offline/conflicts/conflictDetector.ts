import type { ConflictInfo } from '../types';
import { logger } from '@/services/api/logger';

export function detectConflict(
  localData: Record<string, any>,
  serverData: Record<string, any>,
  localUpdatedAt?: string,
  serverUpdatedAt?: string
): ConflictInfo | null {
  if (!localUpdatedAt || !serverUpdatedAt) {
    return null;
  }

  const localTime = new Date(localUpdatedAt).getTime();
  const serverTime = new Date(serverUpdatedAt).getTime();

  if (isNaN(localTime) || isNaN(serverTime)) {
    return null;
  }

  if (serverTime > localTime) {
    return {
      queueItemId: '',
      resource: '',
      serverVersion: serverData,
      localVersion: localData,
      serverUpdatedAt,
      localUpdatedAt,
    };
  }

  return null;
}

export function hasConflict(
  localUpdatedAt: string | undefined,
  serverUpdatedAt: string | undefined
): boolean {
  if (!localUpdatedAt || !serverUpdatedAt) {
    return false;
  }

  const localTime = new Date(localUpdatedAt).getTime();
  const serverTime = new Date(serverUpdatedAt).getTime();

  if (isNaN(localTime) || isNaN(serverTime)) {
    return false;
  }

  return serverTime > localTime;
}

export function compareVersions(
  local: Record<string, any>,
  server: Record<string, any>
): { conflictingFields: string[]; merged: Record<string, any> } {
  const conflictingFields: string[] = [];
  const merged: Record<string, any> = { ...server };

  for (const key of Object.keys(local)) {
    if (key in server && JSON.stringify(local[key]) !== JSON.stringify(server[key])) {
      conflictingFields.push(key);
    } else if (!(key in server)) {
      merged[key] = local[key];
    }
  }

  return { conflictingFields, merged };
}

export function logConflict(conflict: ConflictInfo): void {
  logger.warn('Data conflict detected', {
    resource: conflict.resource,
    queueItemId: conflict.queueItemId,
    serverUpdatedAt: conflict.serverUpdatedAt,
    localUpdatedAt: conflict.localUpdatedAt,
    conflictingFields: compareVersions(conflict.localVersion, conflict.serverVersion)
      .conflictingFields,
  });
}
