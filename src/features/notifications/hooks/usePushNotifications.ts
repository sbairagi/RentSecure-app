import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '@/store/authStore';
import {
  cleanupOnLogout,
  configureNotificationHandler,
  ensureNotificationSetup,
  getNotificationPayload,
  handleNotificationResponse,
  refreshPushToken,
  registerBackgroundNotificationTask,
  requestNotificationPermission,
  setupNotificationCategories,
  setupNotificationChannel,
} from '../services/pushNotificationService';
import { useNotificationStore } from '../store/notificationStore';
import { notificationsRepository } from '../repository';
import { useNotifications, useMarkAsRead } from './useNotifications';
import { routeNotification } from '@/navigation/notification-routing/notificationRouter';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export function usePushNotifications() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>('undetermined');
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const { refetch: refetchNotifications } = useNotifications(undefined, 1, 20);
  const { mutate: markAsRead } = useMarkAsRead();

  const register = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsRegistering(true);
    setError(null);
    try {
      const state = await ensureNotificationSetup();
      setPermissionStatus(state.permissionStatus);
      setExpoPushToken(state.expoPushToken);
      setFcmToken(state.fcmToken);
      if (!state.isRegistered && state.error) {
        setError(state.error);
      }
    } catch (e) {
      setError((e as Error)?.message || 'Notification setup failed');
    } finally {
      setIsRegistering(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    configureNotificationHandler();
    setupNotificationChannel();
    setupNotificationCategories().catch(() => {});
    registerBackgroundNotificationTask().catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      register();
    }
  }, [isAuthenticated, register]);

  useEffect(() => {
    if (!isAuthenticated) {
      setPermissionStatus('undetermined');
      setExpoPushToken(null);
      setFcmToken(null);
      setError(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const payload = getNotificationPayload(notification);
      const { addNotification } = useNotificationStore.getState();
      const notificationType = payload.notification_type || 'system_announcement';
      const notificationId = payload.notification_id || payload.id || Date.now();

      addNotification({
        id: Number(notificationId),
        title: notification.request.content.title || 'New Notification',
        message: notification.request.content.body || '',
        type: notificationType as any,
        is_read: false,
        created_at: new Date().toISOString(),
        data: payload,
        priority: 'medium',
        channels: ['push'],
      });

      refetchNotifications?.();
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => handleNotificationResponse(response, router.replace)
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [refetchNotifications]);

  useEffect(() => {
    if (isAuthenticated && permissionStatus === 'granted') {
      const timer = setTimeout(() => {
        refreshPushToken();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, permissionStatus]);

  const requestPermission = useCallback(async () => {
    const status = await requestNotificationPermission();
    setPermissionStatus(status);
    if (status === 'granted') {
      await register();
    }
    return status;
  }, [register]);

  const refreshToken = useCallback(async () => {
    await refreshPushToken();
  }, []);

  const unregisterDevice = useCallback(async (token?: string) => {
    await cleanupOnLogout();
    if (token) {
      const { unregisterDeviceFromBackend } = await import('../services/pushNotificationService');
      await unregisterDeviceFromBackend(token);
    }
  }, []);

  return {
    permissionStatus,
    hasPermission: permissionStatus === 'granted',
    expoPushToken,
    fcmToken,
    isRegistering,
    isRegistered: isAuthenticated && !!expoPushToken,
    error,
    requestPermission,
    register,
    refreshToken,
    unregisterDevice,
    cleanupOnLogout,
  };
}

export function useNotificationColdStart() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkColdStart = async () => {
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastNotificationResponse) {
        const payload = getNotificationPayload(lastNotificationResponse.notification);
        const notificationId = payload.notification_id || payload.id;

        if (notificationId && isAuthenticated) {
          try {
            await notificationsRepository.markAsRead(Number(notificationId));
          } catch {
            // best-effort
          }

          const result = routeNotification({
            id: String(notificationId),
            title: lastNotificationResponse.notification.request.content.title || '',
            message: lastNotificationResponse.notification.request.content.body || '',
            data: payload,
          });

          if (result.success && result.route) {
            setTimeout(() => {
              router.replace(result.route as any);
            }, 500);
          }
        }
      }
    };

    const timer = setTimeout(checkColdStart, 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);
}

export function useNotificationBadge() {
  const { unreadCount } = useNotificationStore();

  useEffect(() => {
    Notifications.setBadgeCountAsync(unreadCount).catch(() => {});
  }, [unreadCount]);
}
