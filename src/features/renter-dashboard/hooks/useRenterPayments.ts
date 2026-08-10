import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { renterDashboardApi } from '../api/renterDashboardApi';
import type { RenterRentRecord, RenterRentRecordsResponse } from '../types/renterDashboard';

const RENTER_PAYMENTS_QUERY_KEY = (params?: { page?: number; limit?: number }) => ['renter', 'payments', params];
const RENTER_PAYMENT_DETAIL_QUERY_KEY = (id: number | string) => ['renter', 'payment', id];
const RENTER_INVOICES_QUERY_KEY = (params?: { page?: number; limit?: number }) => ['renter', 'invoices', params];

const CACHE_STALE_TIME = 2 * 60 * 1000;
const CACHE_GC_TIME = 10 * 60 * 1000;

export const useRenterPayments = (params?: { page?: number; limit?: number }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RenterRentRecordsResponse>({
    queryKey: RENTER_PAYMENTS_QUERY_KEY(params),
    queryFn: () => renterDashboardApi.getRentRecords(params),
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_PAYMENTS_QUERY_KEY(params) });
  };

  return {
    payments: data?.data || [],
    pagination: data?.meta,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
    total: data?.meta?.total || 0,
  };
};

export const useRenterPaymentDetail = (id: number | string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RenterRentRecord>({
    queryKey: RENTER_PAYMENT_DETAIL_QUERY_KEY(id),
    queryFn: () => renterDashboardApi.getRentRecordDetail(id),
    enabled: !!id,
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_PAYMENT_DETAIL_QUERY_KEY(id) });
  };

  return {
    payment: data,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
  };
};

export const useInitiateRenterPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rentId: number | string) => renterDashboardApi.initiateRentPayment(rentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renter'] });
      showMessage({ message: 'Payment initiated successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || 'Failed to initiate payment', type: 'danger' });
    },
  });
};

export const useVerifyRenterPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => renterDashboardApi.verifyRentPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renter'] });
    },
    onError: (error: Error) => {
      showMessage({ message: error.message || 'Payment verification failed', type: 'danger' });
    },
  });
};

export const useRenterInvoices = (params?: { page?: number; limit?: number }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery<RenterRentRecordsResponse>({
    queryKey: RENTER_INVOICES_QUERY_KEY(params),
    queryFn: () =>
      renterDashboardApi.getRentRecords({
        ...params,
        // Backend returns all records; we filter PAID ones client-side since
        // backend does not expose a dedicated invoice list endpoint for renters.
      }),
    staleTime: CACHE_STALE_TIME,
    gcTime: CACHE_GC_TIME,
    retry: 2,
  });

  const invoices = (data?.data || []).filter((r) => r.payment_status === 'paid' && r.invoice_url);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: RENTER_INVOICES_QUERY_KEY(params) });
  };

  return {
    invoices,
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,
    refetch,
    refresh,
    total: invoices.length,
  };
};
