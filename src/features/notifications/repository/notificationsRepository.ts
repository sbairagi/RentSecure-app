import { notificationsApi } from '../services/notificationsApi';
import type { PaginatedNotifications, NotificationFilters, NotificationPreferences, DeliveryLog, Reminder, DeliveryStats } from '../types';

export const notificationsRepository = {
  fetchNotifications: async (filters?: NotificationFilters, page = 1, limit = 20): Promise<PaginatedNotifications> => {
    const params: Record<string, any> = { page, limit };
    if (filters?.search) params.search = filters.search;
    if (filters?.type && filters.type !== 'all') params.type = filters.type;
    if (filters?.channel && filters.channel !== 'all') params.channel = filters.channel;
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
    // Backend doesn't support bulk - implemented in hook
  },

  deleteNotification: async (id: number): Promise<void> => {
    await notificationsApi.deleteNotification(id);
  },

  saveDeviceToken: async (token: string, platform: string): Promise<void> => {
    await notificationsApi.saveDeviceToken(token, platform);
  },

  registerFCMToken: async (token: string, type: string): Promise<void> => {
    await notificationsApi.registerFCMToken(token, type);
  },

  fetchPreferences: async (): Promise<NotificationPreferences> => {
    return notificationsApi.getPreferences();
  },

  updatePreferences: async (prefs: Partial<NotificationPreferences>): Promise<void> => {
    await notificationsApi.updatePreferences(prefs);
  },

  fetchWhatsAppLogs: async (filters?: any, page = 1, limit = 20): Promise<DeliveryLog[]> => {
    return notificationsApi.getWhatsAppLogs({ page, limit });
  },

  fetchReminders: async (filters?: any, page = 1, limit = 20): Promise<Reminder[]> => {
    return notificationsApi.getReminders({ page, limit });
  },

  getDeliveryStats: async (): Promise<DeliveryStats> => {
    return {
      total_sent: 0,
      total_delivered: 0,
      total_failed: 0,
      delivery_rate: 0,
      by_channel: {},
    };
  },
};
