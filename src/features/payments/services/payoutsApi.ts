import { apiService } from '@/services/api/apiClient';
import type { Payout, PayoutListResponse, PayoutRetryPayload, PayoutSummary } from '../types/payouts';
import { PAYMENT_CONSTANTS } from '../constants/payments';

export const payoutsApi = {
  list: async (params?: { status?: string; payment?: number; page?: number; page_size?: number }): Promise<PayoutListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.payment) searchParams.set('payment', String(params.payment));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    const query = searchParams.toString();
    return apiService.get<PayoutListResponse>(
      `${PAYMENT_CONSTANTS.PAYOUTS.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Payout> => {
    return apiService.get<Payout>(PAYMENT_CONSTANTS.PAYOUTS.DETAIL(id));
  },

  getSummary: async (params?: { period?: string; building?: number }): Promise<PayoutSummary> => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.building) searchParams.set('building', String(params.building));
    const query = searchParams.toString();
    return apiService.get<PayoutSummary>(
      `${PAYMENT_CONSTANTS.PAYOUTS.SUMMARY}${query ? `?${query}` : ''}`
    );
  },

  retry: async (id: number | string, data?: PayoutRetryPayload): Promise<Payout> => {
    return apiService.post<Payout>(PAYMENT_CONSTANTS.PAYOUTS.RETRY(id), data || {});
  },

  bulkRetry: async (data: { payout_ids: number[]; reason?: string }): Promise<{ retried: number; failed: number }> => {
    return apiService.post(PAYMENT_CONSTANTS.PAYOUTS.BULK_RETRY, data);
  },
};
