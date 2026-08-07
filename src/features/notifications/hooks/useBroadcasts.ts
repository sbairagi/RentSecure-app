import { useQuery } from '@tanstack/react-query';

const BROADCASTS_QUERY_KEY = ['notifications', 'broadcasts'];

export function useBroadcasts(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...BROADCASTS_QUERY_KEY, page, limit],
    queryFn: async () => {
      // Backend doesn't have broadcasts API
      return [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: false,
  });
}

export function useBroadcastStats() {
  return useQuery({
    queryKey: ['notifications', 'broadcast-stats'],
    queryFn: async () => ({
      total: 0,
      sent: 0,
      failed: 0,
      channels: {},
    }),
    staleTime: 5 * 60 * 1000,
    enabled: false,
  });
}
