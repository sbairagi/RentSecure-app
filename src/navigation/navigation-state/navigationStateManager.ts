import { create } from 'zustand';

export interface NavigationReadyState {
  isReady: boolean;
  isInitialized: boolean;
  isBootstrapping: boolean;
  error: string | null;
}

export interface PendingDeepLink {
  route: string;
  payload?: Record<string, any>;
  timestamp: number;
}

export interface PendingNotification {
  notificationId: string;
  category: string;
  targetRoute: string;
  resourceId?: string;
  resourceType?: string;
  timestamp: number;
}

export interface NavigationStateManager {
  isReady: boolean;
  isInitialized: boolean;
  isBootstrapping: boolean;
  currentRoute: string | null;
  previousRoute: string | null;
  error: string | null;
  pendingDeepLink: PendingDeepLink | null;
  pendingNotification: PendingNotification | null;
  lastNavigationTimestamp: number | null;
}

export const navigationStateStore = create<NavigationStateManager>(() => ({
  isReady: false,
  isInitialized: false,
  isBootstrapping: true,
  currentRoute: null,
  previousRoute: null,
  error: null,
  pendingDeepLink: null,
  pendingNotification: null,
  lastNavigationTimestamp: null,
}));

export const pendingDeepLinkStore = {
  get: (): PendingDeepLink | null => navigationStateStore.getState().pendingDeepLink,
  set: (pending: PendingDeepLink | null) =>
    navigationStateStore.setState({ pendingDeepLink: pending }),
  clear: () => navigationStateStore.setState({ pendingDeepLink: null }),
};

export const pendingNotificationStore = {
  get: (): PendingNotification | null => navigationStateStore.getState().pendingNotification,
  set: (pending: PendingNotification | null) =>
    navigationStateStore.setState({ pendingNotification: pending }),
  clear: () => navigationStateStore.setState({ pendingNotification: null }),
};

export const navigationReadyStore = {
  isReady: (): boolean => navigationStateStore.getState().isReady,
  setReady: (ready: boolean) => navigationStateStore.setState({ isReady: ready }),
  isInitialized: (): boolean => navigationStateStore.getState().isInitialized,
  setInitialized: (initialized: boolean) =>
    navigationStateStore.setState({ isInitialized: initialized }),
  isBootstrapping: (): boolean => navigationStateStore.getState().isBootstrapping,
  setBootstrapping: (bootstrapping: boolean) =>
    navigationStateStore.setState({ isBootstrapping: bootstrapping }),
  getError: (): string | null => navigationStateStore.getState().error,
  setError: (error: string | null) => navigationStateStore.setState({ error }),
  clearError: () => navigationStateStore.setState({ error: null }),
  getCurrentRoute: (): string | null => navigationStateStore.getState().currentRoute,
  setCurrentRoute: (route: string | null) =>
    navigationStateStore.setState({ currentRoute: route }),
  setPreviousRoute: (route: string | null) =>
    navigationStateStore.setState({ previousRoute: route }),
  setLastNavigationTimestamp: (timestamp: number | null) =>
    navigationStateStore.setState({ lastNavigationTimestamp: timestamp }),
  reset: () =>
    navigationStateStore.setState({
      isReady: false,
      isInitialized: false,
      isBootstrapping: true,
      currentRoute: null,
      previousRoute: null,
      error: null,
      pendingDeepLink: null,
      pendingNotification: null,
      lastNavigationTimestamp: null,
    }),
};
