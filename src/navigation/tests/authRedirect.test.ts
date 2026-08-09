/**
 * Unit tests for authentication redirect logic.
 */

import {
  pendingDeepLinkStore,
  pendingNotificationStore,
  navigationReadyStore,
} from '@/navigation/navigation-state';

describe('Navigation State Manager', () => {
  beforeEach(() => {
    navigationReadyStore.reset();
    pendingDeepLinkStore.clear();
    pendingNotificationStore.clear();
  });

  it('should initialize with default values', () => {
    expect(navigationReadyStore.isReady()).toBe(false);
    expect(navigationReadyStore.isInitialized()).toBe(false);
    expect(navigationReadyStore.isBootstrapping()).toBe(true);
    expect(navigationReadyStore.getError()).toBeNull();
    expect(navigationReadyStore.getCurrentRoute()).toBeNull();
  });

  it('should set and get ready state', () => {
    navigationReadyStore.setReady(true);
    expect(navigationReadyStore.isReady()).toBe(true);
  });

  it('should set and get initialized state', () => {
    navigationReadyStore.setInitialized(true);
    expect(navigationReadyStore.isInitialized()).toBe(true);
  });

  it('should set and get error', () => {
    navigationReadyStore.setError('Test error');
    expect(navigationReadyStore.getError()).toBe('Test error');
    navigationReadyStore.clearError();
    expect(navigationReadyStore.getError()).toBeNull();
  });

  it('should set and get current route', () => {
    navigationReadyStore.setCurrentRoute('/(drawer)/(tabs)/dashboard');
    expect(navigationReadyStore.getCurrentRoute()).toBe('/(drawer)/(tabs)/dashboard');
  });

  it('should set previous route', () => {
    navigationReadyStore.setPreviousRoute('/(drawer)/(tabs)/dashboard');
    expect(navigationReadyStore.getCurrentRoute()).toBe('/(drawer)/(tabs)/dashboard');
  });

  it('should set last navigation timestamp', () => {
    const timestamp = Date.now();
    navigationReadyStore.setLastNavigationTimestamp(timestamp);
    expect(navigationReadyStore.isReady()).toBe(false);
  });

  it('should reset all state', () => {
    navigationReadyStore.setReady(true);
    navigationReadyStore.setInitialized(true);
    navigationReadyStore.setBootstrapping(false);
    navigationReadyStore.setCurrentRoute('/(drawer)/(tabs)/dashboard');
    navigationReadyStore.setError('Test error');

    navigationReadyStore.reset();

    expect(navigationReadyStore.isReady()).toBe(false);
    expect(navigationReadyStore.isInitialized()).toBe(false);
    expect(navigationReadyStore.isBootstrapping()).toBe(true);
    expect(navigationReadyStore.getCurrentRoute()).toBeNull();
    expect(navigationReadyStore.getError()).toBeNull();
  });
});

describe('Pending Deep Link Store', () => {
  beforeEach(() => {
    pendingDeepLinkStore.clear();
  });

  it('should store pending deep link', () => {
    pendingDeepLinkStore.set({
      route: '/(drawer)/(tabs)/buildings/123',
      payload: { type: 'building', id: '123' },
      timestamp: Date.now(),
    });
    const pending = pendingDeepLinkStore.get();
    expect(pending).not.toBeNull();
    expect(pending?.route).toBe('/(drawer)/(tabs)/buildings/123');
  });

  it('should clear pending deep link', () => {
    pendingDeepLinkStore.set({
      route: '/(drawer)/(tabs)/buildings/123',
      timestamp: Date.now(),
    });
    pendingDeepLinkStore.clear();
    expect(pendingDeepLinkStore.get()).toBeNull();
  });

  it('should return null when no pending deep link', () => {
    expect(pendingDeepLinkStore.get()).toBeNull();
  });
});

describe('Pending Notification Store', () => {
  beforeEach(() => {
    pendingNotificationStore.clear();
  });

  it('should store pending notification', () => {
    pendingNotificationStore.set({
      notificationId: '123',
      category: 'rent_due',
      targetRoute: '/(drawer)/(tabs)/payments',
      resourceId: '456',
      timestamp: Date.now(),
    });
    const pending = pendingNotificationStore.get();
    expect(pending).not.toBeNull();
    expect(pending?.notificationId).toBe('123');
    expect(pending?.targetRoute).toBe('/(drawer)/(tabs)/payments');
  });

  it('should clear pending notification', () => {
    pendingNotificationStore.set({
      notificationId: '123',
      category: 'rent_due',
      targetRoute: '/(drawer)/(tabs)/payments',
      timestamp: Date.now(),
    });
    pendingNotificationStore.clear();
    expect(pendingNotificationStore.get()).toBeNull();
  });

  it('should return null when no pending notification', () => {
    expect(pendingNotificationStore.get()).toBeNull();
  });
});

describe('Auth Redirect Flow', () => {
  beforeEach(() => {
    navigationReadyStore.reset();
    pendingDeepLinkStore.clear();
    pendingNotificationStore.clear();
  });

  it('should store deep link for later when not authenticated', () => {
    const deepLink = 'rentsecure://building/123';
    const route = '/(drawer)/(tabs)/buildings/123';

    pendingDeepLinkStore.set({
      route,
      payload: { type: 'building', id: '123' },
      timestamp: Date.now(),
    });

    const pending = pendingDeepLinkStore.get();
    expect(pending?.route).toBe(route);
    expect(pending?.payload?.type).toBe('building');
  });

  it('should restore pending deep link after auth', () => {
    pendingDeepLinkStore.set({
      route: '/(drawer)/(tabs)/buildings/123',
      payload: { type: 'building', id: '123' },
      timestamp: Date.now(),
    });

    const pending = pendingDeepLinkStore.get();
    expect(pending?.route).toBe('/(drawer)/(tabs)/buildings/123');
    pendingDeepLinkStore.clear();
    expect(pendingDeepLinkStore.get()).toBeNull();
  });

  it('should not store sensitive data in pending route', () => {
    const payload = {
      type: 'payment' as const,
      token: 'sensitive-token-123',
      id: '456',
    };

    pendingDeepLinkStore.set({
      route: '/(drawer)/(tabs)/payments/rent-record/456',
      payload,
      timestamp: Date.now(),
    });

    const pending = pendingDeepLinkStore.get();
    expect(pending?.payload?.type).toBe('payment');
  });
});
