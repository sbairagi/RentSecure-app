import { environment } from '@/config/environment';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error: any) => {
        if (environment.appEnv === 'development') {
          console.error('Query retry error:', error?.message || error);
        }
        if (error?.message === 'Network Error' || error?.message === 'No internet connection') {
          return failureCount < environment.apiRetryCount;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: environment.appEnv !== 'development',
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryKeys = {
  auth: {
    login: ['auth', 'login'],
    profile: ['auth', 'profile'],
    refresh: ['auth', 'refresh'],
  },
  dashboard: {
    stats: ['dashboard', 'stats'],
    activity: ['dashboard', 'activity'],
  },
  property: {
    list: ['property', 'list'],
    detail: (id: string) => ['property', 'detail', id],
  },
  buildings: {
    list: ['owner', 'buildings', 'list'],
    detail: (id: string) => ['owner', 'building', id],
  },
  units: {
    list: (buildingId: string) => ['units', 'list', buildingId],
    detail: (id: string) => ['units', 'detail', id],
  },
  renters: {
    list: (params?: Record<string, any>) => ['renters', 'list', params],
    detail: (id: string) => ['renters', 'detail', id],
    statusSummary: ['renters', 'status-summary'],
    timeline: (id: string) => ['renters', id, 'timeline'],
    kycDocuments: (id: string) => ['renters', id, 'kyc-documents'],
    documents: (id: string) => ['renters', id, 'documents'],
    notes: (id: string) => ['renters', id, 'notes'],
    activity: ['renters', 'recent-activity'],
    agreements: (id: string) => ['renters', id, 'agreements'],
    payments: (id: string) => ['renters', id, 'payments'],
    profile: (id: string) => ['renters', 'profile', id],
  },
  caretakers: {
    list: (params?: Record<string, any>) => ['caretakers', 'list', params],
    detail: (id: string) => ['caretakers', 'detail', id],
  },
  agreements: {
    list: ['agreements', 'list'],
    detail: (id: string) => ['agreements', 'detail', id],
  },
  payments: {
    list: ['payments', 'list'],
    detail: (id: string) => ['payments', 'detail', id],
  },
  subscriptions: {
    current: ['subscriptions', 'current'],
    plans: ['subscriptions', 'plans'],
  },
  notifications: {
    list: ['notifications', 'list'],
    unread: ['notifications', 'unread'],
  },
  reports: {
    financial: ['reports', 'financial'],
    occupancy: ['reports', 'occupancy'],
  },
  settings: {
    profile: ['settings', 'profile'],
  },
  search: {
    global: (query: string, filters: Record<string, any>) => ['search', 'global', query, filters],
    suggestions: (query: string) => ['search', 'suggestions', query],
  },
} as const;
