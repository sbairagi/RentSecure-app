import type { Notification, NotificationFilters } from '../types';

export function filterNotifications(
  notifications: Notification[],
  filters: NotificationFilters
): Notification[] {
  let result = [...notifications];

  if (filters.search?.trim()) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
    );
  }

  if (filters.type && filters.type !== 'all') {
    result = result.filter((n) => n.type === filters.type);
  }

  if (filters.read_status && filters.read_status !== 'all') {
    result = result.filter((n) => n.is_read === (filters.read_status === 'read'));
  }

  if (filters.date_from) {
    const from = new Date(filters.date_from);
    result = result.filter((n) => new Date(n.created_at) >= from);
  }

  if (filters.date_to) {
    const to = new Date(filters.date_to);
    result = result.filter((n) => new Date(n.created_at) <= to);
  }

  return result;
}

export function paginateNotifications(
  notifications: Notification[],
  page: number,
  limit: number
): { data: Notification[]; meta: { total: number; page: number; limit: number; totalPages: number } } {
  const start = (page - 1) * limit;
  const data = notifications.slice(start, start + limit);
  return {
    data,
    meta: {
      total: notifications.length,
      page,
      limit,
      totalPages: Math.ceil(notifications.length / limit) || 1,
    },
  };
}
