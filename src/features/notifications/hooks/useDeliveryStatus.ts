import { useQuery } from '@tanstack/react-query';
import { notificationsRepository } from '../repository';
import type { DeliveryLog, DeliveryStats } from '../types';

const DELIVERY_QUERY_KEY = ['notifications', 'delivery'];

export function useDeliveryStats() {
  return useQuery({
    queryKey: [...DELIVERY_QUERY_KEY, 'stats'],
    queryFn: async (): Promise<DeliveryStats> => {
      return {
        total_sent: 0,
        total_delivered: 0,
        total_failed: 0,
        delivery_rate: 0,
        by_channel: {},
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: false,
  });
}

export function useDeliveryLogs(filters?: any, page = 1, limit = 20) {
  const query = useQuery({
    queryKey: [...DELIVERY_QUERY_KEY, 'logs', filters, page, limit],
    queryFn: async (): Promise<DeliveryLog[]> => {
      return notificationsRepository.fetchWhatsAppLogs(filters, page, limit);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    enabled: false,
  });

  return {
    logs: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? (query.error as any).message : null,
    refetch: query.refetch,
  };
}
