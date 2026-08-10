import { useEffect, useSyncExternalStore, useCallback } from 'react';
import { networkManager } from '@/services/api/networkManager';
import type { NetworkState } from '../types';

const NETWORK_STATE_MAP: Record<string, NetworkState> = {
  online: 'online',
  offline: 'offline',
  slow: 'reconnecting',
  unknown: 'unknown',
};

export function useNetworkStatus(): NetworkState {
  const getSnapshot = useCallback(() => {
    return NETWORK_STATE_MAP[networkManager.getStatus()] || 'unknown';
  }, []);

  const subscribe = useCallback((onChange: () => void) => {
    return networkManager.subscribe(() => {
      onChange();
    });
  }, []);

  const getServerSnapshot = useCallback(() => {
    return NETWORK_STATE_MAP[networkManager.getStatus()] || 'unknown';
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsOnline(): boolean {
  const status = useNetworkStatus();
  return status === 'online';
}

export function useIsOffline(): boolean {
  const status = useNetworkStatus();
  return status === 'offline';
}

export function useNetworkMonitor(onStatusChange?: (status: NetworkState) => void): NetworkState {
  const status = useNetworkStatus();

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  return status;
}
