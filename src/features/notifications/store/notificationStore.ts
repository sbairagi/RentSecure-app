import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type { Notification, NotificationFilters, NotificationPreferences } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  filters: NotificationFilters;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;
  expoPushToken: string | null;
  fcmToken: string | null;
  isRegistered: boolean;
  isRegistering: boolean;
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: number, updates: Partial<Notification>) => void;
  removeNotification: (id: number) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  setFilters: (filters: NotificationFilters) => void;
  setPreferences: (prefs: NotificationPreferences | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setExpoPushToken: (token: string | null) => void;
  setFcmToken: (token: string | null) => void;
  setRegistered: (registered: boolean) => void;
  setRegistering: (registering: boolean) => void;
  reset: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  filters: {},
  preferences: null,
  isLoading: false,
  error: null,
  expoPushToken: null,
  fcmToken: null,
  isRegistered: false,
  isRegistering: false,
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  ...initialState,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    set({ notifications, unreadCount });
    void mmkvStorage.setItem('notifications_cache', JSON.stringify(notifications));
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.is_read ? 0 : 1),
    })),

  updateNotification: (id, updates) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      );
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      return { notifications, unreadCount };
    }),

  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = state.unreadCount - (notification && !notification.is_read ? 1 : 0);
      return { notifications, unreadCount: Math.max(0, unreadCount) };
    }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),

  setUnreadCount: (unreadCount) => set({ unreadCount }),

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  setPreferences: (preferences) => set({ preferences }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setExpoPushToken: (expoPushToken) => set({ expoPushToken }),

  setFcmToken: (fcmToken) => set({ fcmToken }),

  setRegistered: (isRegistered) => set({ isRegistered }),

  setRegistering: (isRegistering) => set({ isRegistering }),

  reset: () => set(initialState),
}));
