import { logger } from '@/services/api/logger';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { ConnectivityStatus } from '../types/bootstrap';

const IS_WEB = Platform.OS === 'web';

class ConnectivityService {
  private status: ConnectivityStatus = IS_WEB ? 'online' : 'unknown';
  private listeners: Set<(status: ConnectivityStatus) => void> = new Set();
  private unsubscribe: (() => void) | null = null;

  async getCurrentStatus(): Promise<ConnectivityStatus> {
    if (IS_WEB) return this.status;
    const state = await NetInfo.fetch();
    return this.mapState(state);
  }

  async isConnected(): Promise<boolean> {
    if (IS_WEB) return true;
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  async isSlowNetwork(): Promise<boolean> {
    if (IS_WEB) return false;
    const state = await NetInfo.fetch();
    if (!state.isConnected) return false;
    return state.type === 'cellular' && state.details?.cellularGeneration === '2g';
  }

  async checkBackendAvailability(baseUrl: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        BOOTSTRAP_CONSTANTS.TIMEOUTS.CONNECTIVITY_CHECK
      );

      const response = await fetch(`${baseUrl}/auth/maintenance/`, {
        method: 'HEAD',
        signal: controller.signal,
        // On web, include credentials if the backend requires cookies / CSRF
        credentials: 'omit',
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 401 || response.status === 503;
    } catch {
      logger.warn('Backend availability check failed');
      return false;
    }
  }

  subscribe(listener: (status: ConnectivityStatus) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  startMonitoring(): void {
    if (this.unsubscribe) return;

    if (IS_WEB) {
      // On web the browser polyfill for NetInfo is unreliable; rely on
      // explicit online/offline events and periodic backend checks instead.
      const goOnline = () => {
        this.status = 'online';
        this.notifyListeners('online');
        console.log('[Connectivity] Web: online');
      };
      const goOffline = () => {
        this.status = 'offline';
        this.notifyListeners('offline');
        console.log('[Connectivity] Web: offline');
      };

      window.addEventListener('online', goOnline);
      window.addEventListener('offline', goOffline);

      this.unsubscribe = () => {
        window.removeEventListener('online', goOnline);
        window.removeEventListener('offline', goOffline);
      };

      // Set initial state from navigator
      if (navigator.onLine) {
        this.status = 'online';
        console.log('[Connectivity] Web: initial state = online (navigator.onLine=true)');
      } else {
        this.status = 'offline';
        console.log('[Connectivity] Web: initial state = offline (navigator.onLine=false)');
      }
      this.notifyListeners(this.status);
      return;
    }

    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const newStatus = this.mapState(state);
      if (newStatus !== this.status) {
        const previousStatus = this.status;
        this.status = newStatus;
        this.notifyListeners(newStatus);
        logger.info('Network status changed', { from: previousStatus, to: newStatus });
      }
    });

    NetInfo.fetch().then((state) => {
      this.status = this.mapState(state);
      this.notifyListeners(this.status);
    });
  }

  stopMonitoring(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
  }

  getStatus(): ConnectivityStatus {
    return this.status;
  }

  private mapState(state: NetInfoState): ConnectivityStatus {
    if (!state.isConnected) return 'offline';
    if (state.type === 'cellular' && state.details?.cellularGeneration === '2g') return 'slow';
    if (state.type === 'cellular' && state.details?.cellularGeneration === '3g') return 'slow';
    return 'online';
  }

  private notifyListeners(status: ConnectivityStatus): void {
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (error) {
        logger.error('Connectivity listener error', error as Error);
      }
    });
  }
}

export const connectivityService = new ConnectivityService();
