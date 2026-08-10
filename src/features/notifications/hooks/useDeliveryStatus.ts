import { useQuery } from '@tanstack/react-query';
import { notificationsRepository } from '../repository';
import type { DeliveryLog, DeliveryStats } from '../types';

const DELIVERY_QUERY_KEY = ['notifications', 'delivery'];

const STATUS_NORMALIZED: Record<string, 'delivered' | 'failed' | 'sent'> = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  PERMANENT_FAILED: 'failed',
  RETRYING: 'sent',
  pending: 'sent',
  sent: 'sent',
  delivered: 'delivered',
  failed: 'failed',
};

export function useDeliveryStats() {
  return useQuery({
    queryKey: [...DELIVERY_QUERY_KEY, 'stats'],
    queryFn: async (): Promise<DeliveryStats> => {
      const logs = await notificationsRepository.fetchWhatsAppLogs(undefined, 1, 100);
      const total = logs.length;
      const delivered = logs.filter((l) => STATUS_NORMALIZED[l.status] === 'delivered').length;
      const failed = logs.filter((l) => STATUS_NORMALIZED[l.status] === 'failed').length;
      return {
        total_sent: total,
        total_delivered: delivered,
        total_failed: failed,
        delivery_rate: total > 0 ? Math.round((delivered / total) * 100) : 0,
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
