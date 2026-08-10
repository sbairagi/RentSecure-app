import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { notificationsRepository } from '../repository';
import { useNotificationStore } from '../store/notificationStore';
import type { NotificationFilters, PaginatedNotifications } from '../types';

const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'];
const UNREAD_COUNT_QUERY_KEY = ['notifications', 'unread'];

export function useNotifications(filters?: NotificationFilters, page = 1, limit = 20) {
  const { setNotifications, setLoading } = useNotificationStore();

  const query = useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, filters, page, limit],
    queryFn: async (): Promise<PaginatedNotifications> => {
      setLoading(true);
      const result = await notificationsRepository.fetchNotifications(filters, page, limit);
      setNotifications(result.data);
      return result;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  return {
    notifications: query.data?.data || [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
}

export function useUnreadCount() {
  return useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: async () => {
      const count = await notificationsRepository.fetchUnreadCount();
      useNotificationStore.getState().setUnreadCount(count);
      return count;
    },
    staleTime: 10 * 1000,
    gcTime: 1 * 60 * 1000,
    retry: 2,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { markAsRead: markInStore } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: number) => {
      await notificationsRepository.markAsRead(id);
      return id;
    },
    onSuccess: (id) => {
      markInStore(id);
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to mark as read',
        type: 'danger',
      });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { markAllAsRead: markAllInStore } = useNotificationStore();

  return useMutation({
    mutationFn: async () => {
      await notificationsRepository.markAllAsRead();
    },
    onSuccess: () => {
      markAllInStore();
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
      showMessage({ message: 'All notifications marked as read', type: 'success' });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to mark all as read',
        type: 'danger',
      });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { removeNotification } = useNotificationStore();

  return useMutation({
    mutationFn: async (id: number) => {
      await notificationsRepository.deleteNotification(id);
      return id;
    },
    onSuccess: (id) => {
      removeNotification(id);
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
      showMessage({ message: 'Notification deleted', type: 'success' });
    },
    onError: (err: any) => {
      showMessage({
        message: err?.message || 'Failed to delete notification',
        type: 'danger',
      });
    },
  });
}
