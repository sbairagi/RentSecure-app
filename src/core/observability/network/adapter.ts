import { networkManager } from '@/services/api/networkManager';
import { observabilityLogger } from '../logging';

const originalStart = networkManager.startMonitoring.bind(networkManager);
const originalSubscribe = networkManager.subscribe.bind(networkManager);

networkManager.startMonitoring = () => {
  originalStart();
};

networkManager.subscribe = (listener: (status: 'online' | 'offline' | 'slow' | 'unknown') => void) => {
  const wrappedListener: typeof listener = (status) => {
    if (status === 'online') {
      observabilityLogger.info('Network restored');
    } else if (status === 'offline') {
      observabilityLogger.warn('Network lost');
    } else if (status === 'slow') {
      observabilityLogger.info('Slow network detected');
    }
    listener(status);
  };
  return originalSubscribe(wrappedListener);
};

export { networkManager };
