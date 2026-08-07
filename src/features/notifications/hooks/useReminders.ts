import { useQuery } from '@tanstack/react-query';
import { notificationsRepository } from '../repository';
import type { Reminder, ReminderFilters } from '../types';

const REMINDERS_QUERY_KEY = ['notifications', 'reminders'];

export function useReminders(filters?: ReminderFilters, page = 1, limit = 20) {
  const query = useQuery({
    queryKey: [...REMINDERS_QUERY_KEY, filters, page, limit],
    queryFn: async (): Promise<Reminder[]> => {
      return notificationsRepository.fetchReminders(filters, page, limit);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    enabled: false,
  });

  return {
    reminders: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? (query.error as any).message : null,
    refetch: query.refetch,
  };
}

export function useReminderStats() {
  const query = useQuery({
    queryKey: ['notifications', 'reminder-stats'],
    queryFn: async () => ({
      total: 0,
      scheduled: 0,
      sent: 0,
      failed: 0,
      retrying: 0,
    }),
    staleTime: 5 * 60 * 1000,
    enabled: false,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error ? (query.error as any).message : null,
    refetch: query.refetch,
  };
}
