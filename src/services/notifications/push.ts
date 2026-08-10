export { configureNotificationHandler as initNotifications } from '@/features/notifications/services/pushNotificationService';
export {
  requestNotificationPermission,
  ensureNotificationSetup,
  refreshPushToken,
  cleanupOnLogout,
  setupNotificationChannel,
} from '@/features/notifications/services/pushNotificationService';
export type { NotificationPermissionStatus, PushNotificationState } from '@/features/notifications/services/pushNotificationService';
