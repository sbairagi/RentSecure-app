import { logger } from '@/services/api/logger';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap';
import type { ConnectivityStatus } from '../types/bootstrap';

class ConnectivityService {
  private status: ConnectivityStatus = 'unknown';
  private listeners: Set<(status: ConnectivityStatus) => void> = new Set();
  private unsubscribe: (() => void) | null = null;

  async getCurrentStatus(): Promise<ConnectivityStatus> {
    const state = await NetInfo.fetch();
    return this.mapState(state);
  }

  async isConnected(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  async isSlowNetwork(): Promise<boolean> {
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
