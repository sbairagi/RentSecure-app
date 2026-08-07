import type { Notification } from '../types';

export interface GroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  thisWeek: Notification[];
  thisMonth: Notification[];
  older: Notification[];
}

export function groupNotificationsByDate(notifications: Notification[]): GroupedNotifications {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  return notifications.reduce(
    (acc, notification) => {
      const date = new Date(notification.created_at);
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      if (dateOnly.getTime() === today.getTime()) {
        acc.today.push(notification);
      } else if (dateOnly.getTime() === yesterday.getTime()) {
        acc.yesterday.push(notification);
      } else if (date >= weekAgo) {
        acc.thisWeek.push(notification);
      } else if (date >= monthAgo) {
        acc.thisMonth.push(notification);
      } else {
        acc.older.push(notification);
      }
      return acc;
    },
    {
      today: [] as Notification[],
      yesterday: [] as Notification[],
      thisWeek: [] as Notification[],
      thisMonth: [] as Notification[],
      older: [] as Notification[],
    } as GroupedNotifications
  );
}
