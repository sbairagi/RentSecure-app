import { notificationsApi } from '../services/notificationsApi';
import type {
  PaginatedNotifications,
  NotificationFilters,
  NotificationPreferences,
  DeliveryLog,
  Reminder,
  DeviceToken,
} from '../types';

export const notificationsRepository = {
  fetchNotifications: async (filters?: NotificationFilters, page = 1, limit = 20): Promise<PaginatedNotifications> => {
    const params: Record<string, any> = { page, limit };
    if (filters?.search) params.search = filters.search;
    if (filters?.type && filters.type !== 'all') params.type = filters.type;
    if (filters?.read_status && filters.read_status !== 'all') params.read_status = filters.read_status;
    if (filters?.date_from) params.date_from = filters.date_from;
    if (filters?.date_to) params.date_to = filters.date_to;
    return notificationsApi.getNotifications(params);
  },

  fetchUnreadCount: async (): Promise<number> => {
    const result = await notificationsApi.getUnreadCount();
    return result.count;
  },

  markAsRead: async (id: number): Promise<void> => {
    await notificationsApi.markAsRead(id);
  },

  markAllAsRead: async (): Promise<void> => {
    await notificationsApi.markAllAsRead();
  },

  deleteNotification: async (id: number): Promise<void> => {
    await notificationsApi.deleteNotification(id);
  },

  saveDeviceToken: async (token: string, platform: string, deviceId?: string, fcmToken?: string): Promise<void> => {
    await notificationsApi.saveDeviceToken(token, platform, deviceId, fcmToken);
  },

  registerFCMToken: async (token: string, type: string, expoToken?: string): Promise<void> => {
    await notificationsApi.registerFCMToken(token, type, expoToken);
  },

  fetchPreferences: async (): Promise<NotificationPreferences> => {
    return notificationsApi.getPreferences();
  },

  updatePreferences: async (prefs: Partial<NotificationPreferences>): Promise<void> => {
    await notificationsApi.updatePreferences(prefs);
  },

  fetchDevices: async (): Promise<DeviceToken[]> => {
    return notificationsApi.getDevices();
  },

  unregisterDevice: async (deviceId: number): Promise<void> => {
    await notificationsApi.unregisterDevice(deviceId);
  },

  fetchWhatsAppLogs: async (filters?: any, page = 1, limit = 20): Promise<DeliveryLog[]> => {
    const params: Record<string, any> = { page, limit };
    if (filters?.search) params.search = filters.search;
    if (filters?.type && filters.type !== 'all') params.type = filters.type;
    if (filters?.read_status && filters.read_status !== 'all') params.read_status = filters.read_status;
    if (filters?.date_from) params.date_from = filters.date_from;
    if (filters?.date_to) params.date_to = filters.date_to;
    return notificationsApi.getWhatsAppLogs(params);
  },

  fetchReminders: async (filters?: any, page = 1, limit = 20): Promise<Reminder[]> => {
    const params: Record<string, any> = { page, limit };
    if (filters?.search) params.search = filters.search;
    if (filters?.type && filters.type !== 'all') params.type = filters.type;
    if (filters?.status && filters.status !== 'all') params.status = filters.status;
    if (filters?.date_from) params.date_from = filters.date_from;
    if (filters?.date_to) params.date_to = filters.date_to;
    return notificationsApi.getReminders(params);
  },

  fetchNotificationTypes: async (): Promise<{ value: string; label: string }[]> => {
    return notificationsApi.getNotificationTypes();
  },
};
