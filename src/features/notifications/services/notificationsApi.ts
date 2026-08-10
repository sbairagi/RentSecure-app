import { apiService } from '@/services/api/apiClient';
import type {
  PaginatedNotifications,
  NotificationPreferences,
  DeliveryLog,
  Reminder,
  DeviceToken,
} from '@/features/notifications/types';
import { NOTIFICATION_ENDPOINTS } from '@/features/notifications/constants';

export const notificationsApi = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    read_status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<PaginatedNotifications> => {
    const response = await apiService.get<PaginatedNotifications>(
      NOTIFICATION_ENDPOINTS.LIST,
      { params }
    );
    return response as PaginatedNotifications;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiService.get<{ count: number }>(NOTIFICATION_ENDPOINTS.UNREAD_COUNT);
    return response as { count: number };
  },

  markAsRead: async (id: number): Promise<{ status: string }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.MARK_READ(id), {});
  },

  markAllAsRead: async (): Promise<{ status: string }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.MARK_ALL_READ, {});
  },

  deleteNotification: async (id: number): Promise<{ status: string }> => {
    return apiService.delete(NOTIFICATION_ENDPOINTS.DELETE(id));
  },

  saveDeviceToken: async (
    token: string,
    platform: string = 'expo',
    deviceId?: string,
    fcmToken?: string,
  ): Promise<{ status: string; device_id?: number }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.SAVE_TOKEN, {
      token,
      platform,
      device_id: deviceId,
      fcm_token: fcmToken,
    });
  },

  registerFCMToken: async (
    token: string,
    type: string = 'android',
    expoToken?: string,
  ): Promise<{ status: string }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.REGISTER_FCM, {
      token,
      type,
      expo_token: expoToken,
    });
  },

  getDevices: async (): Promise<DeviceToken[]> => {
    const response = await apiService.get<DeviceToken[]>(NOTIFICATION_ENDPOINTS.DEVICES);
    return response as DeviceToken[];
  },

  unregisterDevice: async (deviceId: number): Promise<{ status: string }> => {
    return apiService.delete(NOTIFICATION_ENDPOINTS.DEVICE_DELETE(deviceId));
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await apiService.get<NotificationPreferences>(NOTIFICATION_ENDPOINTS.PREFERENCES_GET);
    return response as NotificationPreferences;
  },

  updatePreferences: async (prefs: Partial<NotificationPreferences>): Promise<{ success: boolean; message: string }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.PREFERENCES, prefs);
  },

  getWhatsAppLogs: async (params?: { page?: number; limit?: number }): Promise<DeliveryLog[]> => {
    const response = await apiService.get<DeliveryLog[]>(NOTIFICATION_ENDPOINTS.WHATSAPP_LOGS, { params });
    return response as DeliveryLog[];
  },

  getReminders: async (params?: { page?: number; limit?: number }): Promise<Reminder[]> => {
    const response = await apiService.get<Reminder[]>(NOTIFICATION_ENDPOINTS.REMINDERS, { params });
    return response as Reminder[];
  },

  getNotificationTypes: async (): Promise<
    Array<{ value: string; label: string }>
  > => {
    const response = await apiService.get<Array<{ value: string; label: string }>>(
      NOTIFICATION_ENDPOINTS.NOTIFICATION_TYPES
    );
    return response;
  },
};
