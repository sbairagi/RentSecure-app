import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { routeNotification } from './notificationRouter';
import { pendingDeepLinkStore, pendingNotificationStore, navigationReadyStore } from '@/navigation/navigation-state';

export interface NotificationHandlerResult {
  success: boolean;
  route?: string;
  error?: string;
  requiresAuth?: boolean;
}

export function useNotificationHandler() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();

  const handleNotificationTap = useCallback(
    async (
      notification: { id: string; title: string; message: string; data?: Record<string, any> }
    ): Promise<NotificationHandlerResult> => {
      if (authLoading) {
        pendingNotificationStore.set({
          notificationId: notification.id,
          category: 'general',
          targetRoute: '/(drawer)/(tabs)/notifications/list',
          timestamp: Date.now(),
        });
        return { success: false, error: 'Authentication loading' };
      }

      const result = routeNotification(notification, user?.role);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      if (!isAuthenticated) {
        pendingNotificationStore.set({
          notificationId: notification.id,
          category: 'general',
          targetRoute: result.route || '/(drawer)/(tabs)/notifications/list',
          resourceId: result.resourceId,
          timestamp: Date.now(),
        });
        return {
          success: false,
          requiresAuth: true,
          route: result.route,
        };
      }

      if (result.route) {
        router.replace(result.route as any);
        navigationReadyStore.setLastNavigationTimestamp(Date.now());
      }

      return {
        success: true,
        route: result.route,
      };
    },
    [isAuthenticated, user, router, authLoading]
  );

  const handleColdStartNotification = useCallback(
    async (notification: { id: string; title: string; message: string; data?: Record<string, any> }): Promise<void> => {
      const result = routeNotification(notification, user?.role);

      if (!result.success) {
        pendingNotificationStore.set({
          notificationId: notification.id,
          category: 'general',
          targetRoute: '/(drawer)/(tabs)/notifications/list',
          timestamp: Date.now(),
        });
        return;
      }

      pendingNotificationStore.set({
        notificationId: notification.id,
        category: 'general',
        targetRoute: result.route || '/(drawer)/(tabs)/notifications/list',
        resourceId: result.resourceId,
        timestamp: Date.now(),
      });
    },
    [user?.role]
  );

  const restorePendingNotification = useCallback(async (): Promise<void> => {
    const pending = pendingNotificationStore.get();
    if (!pending) return;

    if (!isAuthenticated) {
      return;
    }

    if (pending.targetRoute) {
      router.replace(pending.targetRoute as any);
      pendingNotificationStore.clear();
      navigationReadyStore.setLastNavigationTimestamp(Date.now());
    }
  }, [isAuthenticated, router]);

  const handleWarmStartNotification = useCallback(
    async (notification: { id: string; title: string; message: string; data?: Record<string, any> }): Promise<void> => {
      if (!isAuthenticated) {
        handleColdStartNotification(notification);
        return;
      }

      const result = await handleNotificationTap(notification);
      if (!result.success && result.requiresAuth) {
        handleColdStartNotification(notification);
      }
    },
    [isAuthenticated, handleNotificationTap, handleColdStartNotification]
  );

  return {
    handleNotificationTap,
    handleColdStartNotification,
    handleWarmStartNotification,
    restorePendingNotification,
    routeNotification,
  };
}
