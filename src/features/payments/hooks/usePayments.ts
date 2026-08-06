import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';
import { paymentsRepository } from '../repository/paymentsRepository';
import { usePaymentsStore } from '../store/paymentsStore';
import type { PaymentFilters, PaymentListResponse, PaymentSummary, PaymentAnalytics, PaymentTimelineEntry } from '../types/payments';
import { PAYMENT_CONSTANTS } from '../constants/payments';

const PAYMENTS_QUERY_KEY = (params?: PaymentFilters) => ['payments', 'list', params];
const PAYMENT_DETAIL_QUERY_KEY = (id: number | string) => ['payments', 'detail', id];
const PAYMENT_SUMMARY_QUERY_KEY = (params?: { period?: string; building?: number }) => ['payments', 'summary', params];
const PAYMENT_ANALYTICS_QUERY_KEY = (params?: { period?: string; building?: number }) => ['payments', 'analytics', params];
const OVERDUE_QUERY_KEY = (params?: PaymentFilters) => ['payments', 'overdue', params];
const PENDING_QUERY_KEY = (params?: PaymentFilters) => ['payments', 'pending', params];
const FAILED_QUERY_KEY = (params?: PaymentFilters) => ['payments', 'failed', params];

const CACHE_STALE_TIME = 2 * 60 * 1000;
const CACHE_GC_TIME = 10 * 60 * 1000;
const ANALYTICS_STALE_TIME = 5 * 60 * 1000;

export const usePayments = (params?: PaymentFilters) => {
  const queryClient = useQueryClient();
  const { setPayments, setError } = usePaymentsStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery<PaymentListResponse>({
    queryKey: PAYMENTS_QUERY_KEY(params),
    queryFn: () => paymentsRepository.fetchPayments(params),
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY(params) });
  }, [params, queryClient]);

  const payments = usePaymentsStore((state) => state.payments);

  return {
    payments,
    data,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: data?.count || 0,
    refetch,
  };
};

export const usePaymentDetails = (id: number | string) => {
  const queryClient = useQueryClient();
  const { setSelectedPayment, setError } = usePaymentsStore();

  const { data, isLoading, isFetching, error, refetch } = useQuery<PaymentListResponse['results'][0]>({
    queryKey: PAYMENT_DETAIL_QUERY_KEY(id),
    queryFn: () => paymentsRepository.fetchPayment(id),
    enabled: !!id,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (data && !Array.isArray(data)) {
      setSelectedPayment(data as any);
    }
  }, [data, setSelectedPayment]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  return {
    payment: data && !Array.isArray(data) ? data as any : null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};

export const usePaymentSummary = (params?: { period?: string; building?: number }) => {
  const { setSummary, setError } = usePaymentsStore();

  const { data, isLoading, error, refetch } = useQuery<PaymentSummary>({
    queryKey: PAYMENT_SUMMARY_QUERY_KEY(params),
    queryFn: () => paymentsRepository.fetchPaymentSummary(params),
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      setSummary(data);
    }
  }, [data, setSummary]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  return {
    summary: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};

export const usePaymentAnalytics = (params?: { period?: string; building?: number }) => {
  const { setAnalytics, setError } = usePaymentsStore();

  const { data, isLoading, error, refetch } = useQuery<PaymentAnalytics>({
    queryKey: PAYMENT_ANALYTICS_QUERY_KEY(params),
    queryFn: () => paymentsRepository.fetchPaymentAnalytics(params),
    staleTime: ANALYTICS_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      setAnalytics(data);
    }
  }, [data, setAnalytics]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  return {
    analytics: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};

export const useOverduePayments = (params?: PaymentFilters) => {
  const { setPayments, setError } = usePaymentsStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<PaymentListResponse>({
    queryKey: OVERDUE_QUERY_KEY(params),
    queryFn: () => paymentsRepository.fetchOverduePayments(params),
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      const list = data.results || [];
      setPayments(list);
    }
  }, [data, setPayments]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: OVERDUE_QUERY_KEY(params) });
  }, [params, queryClient]);

  return {
    payments: data?.results || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: data?.count || 0,
    refetch,
  };
};

export const usePendingPayments = (params?: PaymentFilters) => {
  const { setPayments, setError } = usePaymentsStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<PaymentListResponse>({
    queryKey: PENDING_QUERY_KEY(params),
    queryFn: () => paymentsRepository.fetchPendingPayments(params),
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      const list = data.results || [];
      setPayments(list);
    }
  }, [data, setPayments]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PENDING_QUERY_KEY(params) });
  }, [params, queryClient]);

  return {
    payments: data?.results || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: data?.count || 0,
    refetch,
  };
};

export const useFailedPayments = (params?: PaymentFilters) => {
  const { setPayments, setError } = usePaymentsStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<PaymentListResponse>({
    queryKey: FAILED_QUERY_KEY(params),
    queryFn: () => paymentsRepository.fetchFailedPayments(params),
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (data) {
      const list = data.results || [];
      setPayments(list);
    }
  }, [data, setPayments]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: FAILED_QUERY_KEY(params) });
  }, [params, queryClient]);

  return {
    payments: data?.results || [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
    total: data?.count || 0,
    refetch,
  };
};

export const useRetryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data?: any }) =>
      paymentsRepository.retryPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showMessage({ message: 'Payment retry initiated successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC, type: 'danger' });
    },
  });
};

export const useCancelPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number | string; reason?: string }) =>
      paymentsRepository.cancelPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showMessage({ message: 'Payment cancelled successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC, type: 'danger' });
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: { amount: string; reason: string; notify_renter?: boolean } }) =>
      paymentsRepository.refundPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showMessage({ message: 'Refund processed successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC, type: 'danger' });
    },
  });
};

export const useSendReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: { reminder_types: string[]; message?: string } }) =>
      paymentsRepository.sendReminder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showMessage({ message: 'Reminder sent successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC, type: 'danger' });
    },
  });
};

export const useBulkRetryPayments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { payment_ids: number[]; reason?: string }) =>
      paymentsRepository.bulkRetryPayments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showMessage({ message: 'Bulk retry initiated successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC, type: 'danger' });
    },
  });
};

export const useCollectRent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => paymentsRepository.collectRent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showMessage({ message: 'Rent collected successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC, type: 'danger' });
    },
  });
};

export const usePaymentTimeline = (id: number | string | null) => {
  const { setError } = usePaymentsStore();

  const { data, isLoading, error, refetch } = useQuery<PaymentTimelineEntry[]>({
    queryKey: ['payments', 'timeline', id],
    queryFn: () => paymentsRepository.fetchPaymentTimeline(id!),
    enabled: !!id,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : PAYMENT_CONSTANTS.ERROR_MESSAGES.GENERIC;
      setError(message);
    }
  }, [error, setError]);

  return {
    timeline: data,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
};
