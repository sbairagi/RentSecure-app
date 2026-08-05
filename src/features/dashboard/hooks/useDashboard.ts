import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';
import { dashboardApi } from '../services/dashboardApi';
import { useDashboardStore } from '../store/dashboardStore';
import type { DashboardResponse, DashboardSummary } from '../types/dashboard';

const DASHBOARD_QUERY_KEY = ['dashboard'];
const DASHBOARD_SUMMARY_QUERY_KEY = ['dashboard', 'summary'];

export const useDashboard = () => {
  const { setData, setError } = useDashboardStore();

  const {
    data: dashboardData,
    isLoading: isQueryLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async (): Promise<DashboardResponse> => {
      const data = await dashboardApi.getOwnerDashboard();
      useDashboardStore.getState().cacheData(data);
      return data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    initialData: () => {
      const cached = useDashboardStore.getState().data;
      return cached ?? undefined;
    },
  });

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: async (): Promise<DashboardSummary> => {
      return dashboardApi.getOwnerDashboardSummary();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnReconnect: true,
  });

  const refreshDashboard = useCallback(async () => {
    try {
      setError(null);
      const result = await refetch();
      if (result.data) {
        setData(result.data);
      }
      await refetchSummary();
    } catch (err: any) {
      const message = err?.message || 'Failed to refresh dashboard';
      setError(message);
      showMessage({ message, type: 'danger' });
    }
  }, [refetch, refetchSummary, setData, setError]);

  const handlePullToRefresh = useCallback(async () => {
    try {
      const result = await refetch();
      if (result.data) {
        setData(result.data);
      }
    } catch (err: any) {
      const message = err?.message || 'Pull to refresh failed';
      setError(message);
    }
  }, [refetch, setData, setError]);

  return {
    data: dashboardData,
    summary: summaryData,
    isLoading: isQueryLoading,
    isSummaryLoading,
    isFetching,
    error: error?.message || null,
    refreshDashboard,
    pullToRefresh: handlePullToRefresh,
    refetch,
  };
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      return dashboardApi.getNotifications();
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useUnitAnalytics = () => {
  return useQuery({
    queryKey: ['unit-analytics'],
    queryFn: async () => {
      return dashboardApi.getUnitAnalytics();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const usePoliceVerificationStats = () => {
  return useQuery({
    queryKey: ['police-verification-stats'],
    queryFn: async () => {
      return dashboardApi.getPoliceVerificationStats();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};
