import React, { useCallback, useEffect, useRef } from 'react';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import { bootstrapService } from '../services/bootstrapService';
import { connectivityService } from '../services/connectivityService';
import { useAppStore } from '../stores/appStore';
import type { BootstrapErrorType, BootstrapPhase, ConnectivityStatus } from '../types/bootstrap';

export function useBootstrap() {
  const store = useAppStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = bootstrapService.subscribeToPhase((phase) => {
      store.setPhase(phase);
    });

    return () => {
      unsubscribe();
    };
  }, [store]);

  const initialize = useCallback(async (): Promise<boolean> => {
    if (initializedRef.current) {
      return useAppStore.getState().isInitialized;
    }

    initializedRef.current = true;
    const result = await store.initialize();
    return result.success;
  }, [store]);

  const reload = useCallback(async (): Promise<boolean> => {
    initializedRef.current = false;
    const result = await store.reload();
    if (result.success) {
      initializedRef.current = true;
    }
    return result.success;
  }, [store]);

  const reset = useCallback(() => {
    initializedRef.current = false;
    store.reset();
  }, [store]);

  const retry = useCallback(async (): Promise<boolean> => {
    const success = await bootstrapService.retry();
    if (success) {
      initializedRef.current = true;
    }
    return success;
  }, []);

  return {
    initialize,
    reload,
    reset,
    retry,
    isInitialized: store.isInitialized,
    currentPhase: store.currentPhase,
    error: store.error,
    errorMessage: store.errorMessage,
    isOnline: store.isOnline,
    isMaintenance: store.isMaintenance,
    isForceUpdate: store.isForceUpdate,
    retryCount: store.retryCount,
  };
}

export function useBootstrapPhase(phase: BootstrapPhase): boolean {
  const currentPhase = useAppStore((s) => s.currentPhase);
  const phases = BOOTSTRAP_CONSTANTS.PHASES_ORDER as readonly string[];
  const phaseIndex = phases.includes(phase) ? phases.indexOf(phase) : -1;
  const currentIndex = phases.includes(currentPhase) ? phases.indexOf(currentPhase) : -1;

  if (currentPhase === 'completed') return true;
  if (currentPhase === 'failed') return false;
  if (currentPhase === 'idle') return false;

  return currentIndex >= phaseIndex;
}

export function useBootstrapError(): {
  error: BootstrapErrorType | null;
  errorMessage: string;
  hasError: boolean;
  isBackendDown: boolean;
  isMaintenance: boolean;
  isInternetLost: boolean;
  isExpiredToken: boolean;
  isVersionUnsupported: boolean;
  isForceUpdate: boolean;
  clearError: () => void;
} {
  const error = useAppStore((s) => s.error);
  const errorMessage = useAppStore((s) => s.errorMessage);
  const isMaintenance = useAppStore((s) => s.isMaintenance);
  const isForceUpdate = useAppStore((s) => s.isForceUpdate);

  const clearError = useCallback(() => {
    useAppStore.getState().setError(null);
  }, []);

  return {
    error,
    errorMessage,
    hasError: error !== null,
    isBackendDown: error === 'backend_down',
    isMaintenance: error === 'maintenance' || isMaintenance,
    isInternetLost: error === 'internet_lost',
    isExpiredToken: error === 'expired_token',
    isVersionUnsupported: error === 'version_unsupported',
    isForceUpdate: error === 'version_unsupported' || isForceUpdate,
    clearError,
  };
}

export function useConnectivity() {
  const [status, setStatus] = React.useState<ConnectivityStatus>('unknown');
  const [isOnline, setIsOnline] = React.useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const currentStatus = await connectivityService.getCurrentStatus();
      setStatus(currentStatus);
      setIsOnline(currentStatus === 'online' || currentStatus === 'slow');
    };

    checkStatus();

    const unsubscribe = connectivityService.subscribe((newStatus) => {
      setStatus(newStatus);
      setIsOnline(newStatus === 'online' || newStatus === 'slow');
    });

    return () => unsubscribe();
  }, []);

  const checkBackend = useCallback(async (): Promise<boolean> => {
    const { environment } = await import('@/config/environment');
    return connectivityService.checkBackendAvailability(environment.apiUrl);
  }, []);

  return {
    status,
    isOnline,
    isOffline: status === 'offline',
    isSlow: status === 'slow',
    checkBackend,
  };
}
