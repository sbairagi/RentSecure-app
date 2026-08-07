import { apiService } from '@/services/api/apiClient';
import type { PaginatedNotifications, NotificationPreferences, DeliveryLog, DeliveryStats, Reminder } from '@/features/notifications/types';
import { NOTIFICATION_ENDPOINTS } from '@/features/notifications/constants';

export const notificationsApi = {
  getNotifications: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedNotifications> => {
    const response = await apiService.get('/api/notifications/get/', { params });
    const data = response as any[];
    return {
      data: data.map((item: any) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        is_read: item.is_read,
        created_at: item.created_at,
        type: item.type as any,
        priority: item.priority as any,
        channels: item.channels as any[],
        data: item.data,
        action_url: item.action_url,
        action_label: item.action_label,
        image_url: item.image_url,
        archived: item.archived,
      })),
      meta: {
        total: data.length,
        page: params?.page || 1,
        limit: params?.limit || data.length,
        totalPages: 1,
      },
    };
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const data = await apiService.get('/api/notifications/get/');
    const notifications = data as any[];
    return { count: notifications.filter((n) => !n.is_read).length };
  },

  markAsRead: async (id: number): Promise<{ status: string }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.MARK_READ(id), {});
  },

  markAllAsRead: async (): Promise<{ status: string }> => {
    // Backend doesn't support this - frontend will iterate
    return { status: 'not_supported' };
  },

  deleteNotification: async (_id: number): Promise<void> => {
    // Backend doesn't support delete
    throw new Error('Delete not supported by backend');
  },

  saveDeviceToken: async (token: string, platform: string = 'expo'): Promise<{ status: string }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.SAVE_TOKEN, { token, platform });
  },

  registerFCMToken: async (token: string, type: string = 'android'): Promise<{ status: string }> => {
    return apiService.post(NOTIFICATION_ENDPOINTS.REGISTER_FCM, { token, type });
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    // Use existing core endpoint
    const data = await apiService.get('/api/owner/update-alert-preferences/');
    return data as NotificationPreferences;
  },

  updatePreferences: async (preferences: Partial<NotificationPreferences>): Promise<{ success: boolean; message: string }> => {
    return apiService.post('/api/owner/update-alert-preferences/', preferences);
  },

  getWhatsAppLogs: async (_params?: { page?: number; limit?: number }): Promise<DeliveryLog[]> => {
    // Backend doesn't have this endpoint
    return [];
  },

  getReminders: async (_params?: { page?: number; limit?: number }): Promise<Reminder[]> => {
    // Backend doesn't have this endpoint
    return [];
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
