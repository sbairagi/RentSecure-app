import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { logger } from './logger';
import type { NetworkStatus } from './types';

class NetworkManager {
  private currentStatus: NetworkStatus = 'unknown';
  private listeners: Set<(status: NetworkStatus) => void> = new Set();
  private unsubscribe: (() => void) | null = null;

  async getCurrentStatus(): Promise<NetworkStatus> {
    const state = await NetInfo.fetch();
    return this.mapStateToStatus(state);
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

  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  startMonitoring(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const newStatus = this.mapStateToStatus(state);
      if (newStatus !== this.currentStatus) {
        this.currentStatus = newStatus;
        this.notifyListeners(newStatus);
        this.logStatusChange(newStatus);
      }
    });

    NetInfo.fetch().then((state) => {
      this.currentStatus = this.mapStateToStatus(state);
      this.notifyListeners(this.currentStatus);
    });
  }

  stopMonitoring(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
  }

  private mapStateToStatus(state: NetInfoState): NetworkStatus {
    if (!state.isConnected) return 'offline';
    if (state.type === 'cellular' && state.details?.cellularGeneration === '2g') return 'slow';
    if (state.type === 'cellular' && state.details?.cellularGeneration === '3g') return 'slow';
    return 'online';
  }

  private notifyListeners(status: NetworkStatus): void {
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (error) {
        logger.error('Network listener error', error as Error);
      }
    });
  }

  private logStatusChange(status: NetworkStatus): void {
    logger.info(`Network status changed: ${status}`);
  }

  getStatus(): NetworkStatus {
    return this.currentStatus;
  }
}

export const networkManager = new NetworkManager();
