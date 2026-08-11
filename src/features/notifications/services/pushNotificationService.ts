import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { notificationsApi } from '../services/notificationsApi';
import { useAuthStore } from '@/store/authStore';
import { logger } from '@/services/api/logger';
import type { Notification } from '../types';

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined';

export interface PushNotificationState {
  hasPermission: boolean;
  permissionStatus: NotificationPermissionStatus;
  expoPushToken: string | null;
  fcmToken: string | null;
  isRegistered: boolean;
  isRegistering: boolean;
  error: string | null;
}

export interface RegisterDeviceOptions {
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceId?: string;
  fcmToken?: string | null;
}

export const BACKGROUND_NOTIFICATION_TASK = 'rentsecure-background-notification';

TaskManager.defineTask<Notifications.NotificationTaskPayload>(BACKGROUND_NOTIFICATION_TASK, ({ data }) => {
  const isResponse = 'actionIdentifier' in data;
  if (!isResponse) {
    const notificationId = data?.data?.notification_id || data?.data?.id;
    if (notificationId) {
      // Background tasks cannot make network requests.
      // The foreground notification listener will sync the read state.
    }
  }
  return { __skipDuplicates: true } as any;
});

export async function registerBackgroundNotificationTask(): Promise<void> {
  try {
    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  } catch (error) {
    logger.error('Failed to register background notification task', error as Error);
  }
}

export async function setupNotificationCategories(): Promise<void> {
  await Notifications.setNotificationCategoryAsync('rent_action', [
    {
      buttonTitle: 'View Payment',
      identifier: 'VIEW_PAYMENT',
      options: { opensAppToForeground: true },
    },
  ]);

  await Notifications.setNotificationCategoryAsync('maintenance_action', [
    {
      buttonTitle: 'View Request',
      identifier: 'VIEW_MAINTENANCE',
      options: { opensAppToForeground: true },
    },
  ]);

  await Notifications.setNotificationCategoryAsync('agreement_action', [
    {
      buttonTitle: 'View Agreement',
      identifier: 'VIEW_AGREEMENT',
      options: { opensAppToForeground: true },
    },
  ]);

  await Notifications.setNotificationCategoryAsync('subscription_action', [
    {
      buttonTitle: 'View Subscription',
      identifier: 'VIEW_SUBSCRIPTION',
      options: { opensAppToForeground: true },
    },
  ]);
}

export function getCategoryForNotificationType(type: string): string | undefined {
  const map: Record<string, string> = {
    rent_due: 'rent_action',
    payment_success: 'rent_action',
    payment_failed: 'rent_action',
    maintenance_created: 'maintenance_action',
    maintenance_update: 'maintenance_action',
    agreement_expiry: 'agreement_action',
    agreement_signed: 'agreement_action',
    subscription_expiring: 'subscription_action',
    subscription_expired: 'subscription_action',
  };
  return map[type];
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === Notifications.PermissionStatus.GRANTED) return 'granted';
    if (status === Notifications.PermissionStatus.DENIED) return 'denied';
    return 'undetermined';
  } catch (error) {
    logger.error('Failed to request notification permission', error as Error);
    return 'undetermined';
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  try {
    if (!Device.isDevice) return null;
    const { data } = await Notifications.getExpoPushTokenAsync({
      projectId: undefined,
    });
    return data;
  } catch (error) {
    logger.error('Failed to get expo push token', error as Error);
    return null;
  }
}

export async function getFCMToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'ios') return null;
    const token = await Notifications.getDevicePushTokenAsync();
    return token?.data ?? null;
  } catch (error) {
    logger.error('Failed to get FCM token', error as Error);
    return null;
  }
}

export async function registerDeviceWithBackend(
  options: RegisterDeviceOptions,
): Promise<boolean> {
  try {
    const { token, platform, deviceId, fcmToken } = options;
    await notificationsApi.saveDeviceToken(token, platform, deviceId, fcmToken ?? undefined);
    const { markAsRead } = useNotificationStore.getState();
    useNotificationStore.setState({ isRegistered: true, expoPushToken: token, fcmToken: fcmToken ?? null, error: null });
    logger.info('Device registered with backend', { platform, hasFcm: !!fcmToken });
    return true;
  } catch (error) {
    const message = (error as Error)?.message || 'Failed to register device';
    logger.error('Device registration failed', error as Error);
    useNotificationStore.setState({ error: message, isRegistered: false });
    return false;
  }
}

export async function unregisterDeviceFromBackend(token?: string): Promise<void> {
  try {
    const devices = await notificationsApi.getDevices();
    const target = devices.find((d) => d.token === token);
    if (target?.id) {
      await notificationsApi.unregisterDevice(target.id);
    }
  } catch (error) {
    logger.error('Device unregistration failed', error as Error);
  }
}

export async function ensureNotificationSetup(): Promise<PushNotificationState> {
  const authStore = useAuthStore.getState();
  const store = useNotificationStore.getState();
  const isAuthenticated = authStore.isAuthenticated;

  const permissionStatus = await requestNotificationPermission();
  const hasPermission = permissionStatus === 'granted';

  let expoPushToken: string | null = null;
  let fcmToken: string | null = null;

  if (hasPermission) {
    expoPushToken = await getExpoPushToken();
    fcmToken = await getFCMToken();

    if (isAuthenticated && expoPushToken) {
      store.setRegistering(true);
      const registered = await registerDeviceWithBackend({
        token: expoPushToken,
        platform: Platform.OS as 'ios' | 'android' | 'web',
        fcmToken,
      });
      store.setRegistering(false);
      return {
        hasPermission,
        permissionStatus,
        expoPushToken,
        fcmToken,
        isRegistered: registered,
        isRegistering: false,
        error: registered ? null : 'Device registration failed',
      };
    }
  }

  return {
    hasPermission,
    permissionStatus,
    expoPushToken,
    fcmToken,
    isRegistered: false,
    isRegistering: false,
    error: null,
  };
}

export async function refreshPushToken(): Promise<string | null> {
  const expoPushToken = await getExpoPushToken();
  const fcmToken = await getFCMToken();
  const authStore = useAuthStore.getState();

  if (authStore.isAuthenticated && expoPushToken) {
    await registerDeviceWithBackend({
      token: expoPushToken,
      platform: Platform.OS as 'ios' | 'android' | 'web',
      fcmToken,
    });
  }

  useNotificationStore.setState({ expoPushToken, fcmToken });
  return expoPushToken;
}

export async function handleNotificationResponse(
  response: Notifications.NotificationResponse,
  navigate?: (route: string) => void,
): Promise<void> {
  const { markAsRead } = useNotificationStore.getState();
  const notification = response.notification;
  const actionIdentifier = response.actionIdentifier;

  if (notification?.request?.content?.data) {
    const data = notification.request.content.data as Record<string, any>;
    const notificationId = data.notification_id || data.id;

    if (notificationId) {
      try {
        await notificationsApi.markAsRead(Number(notificationId));
        markAsRead(Number(notificationId));
      } catch {
        // best-effort
      }
    }
  }

  if (actionIdentifier && actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER && navigate) {
    const actionRouteMap: Record<string, (data: Record<string, any>) => string | null> = {
      VIEW_PAYMENT: (data) => {
        const rid = data?.resource_id;
        return rid ? `/(drawer)/(tabs)/payments/rent-record/${rid}` : null;
      },
      VIEW_MAINTENANCE: (data) => {
        const rid = data?.resource_id;
        return rid ? `/(drawer)/(tabs)/maintenance/${rid}` : null;
      },
      VIEW_AGREEMENT: (data) => {
        const rid = data?.resource_id;
        return rid ? `/(drawer)/(tabs)/agreements/${rid}` : null;
      },
      VIEW_SUBSCRIPTION: () => '/(drawer)/(tabs)/subscription',
    };

    const routeBuilder = actionRouteMap[actionIdentifier];
    if (routeBuilder) {
      const data = (notification?.request?.content?.data as Record<string, any>) || {};
      const route = routeBuilder(data);
      if (route) {
        navigate(route);
      }
    }
  }
}

export function getNotificationPayload(
  notification: Notifications.Notification,
): Record<string, any> {
  return notification.request.content.data || {};
}

export async function cleanupOnLogout(): Promise<void> {
  try {
    const { expoPushToken } = useNotificationStore.getState();
    if (expoPushToken) {
      await unregisterDeviceFromBackend(expoPushToken);
    }
  } catch (error) {
    logger.error('Logout cleanup failed', error as Error);
  } finally {
    useNotificationStore.setState({
      expoPushToken: null,
      fcmToken: null,
      isRegistered: false,
      error: null,
    });
  }
}

export function setupNotificationChannel(): void {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#208AEF',
      bypassDnd: false,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }) as any,
  });
}
