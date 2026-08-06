import { apiService } from '@/services/api/apiClient';
import type { RefundPayload } from '../types/payments';
import { PAYMENT_CONSTANTS } from '../constants/payments';

export const refundsApi = {
  list: async (params?: { payment?: number; status?: string; page?: number }): Promise<any> => {
    const searchParams = new URLSearchParams();
    if (params?.payment) searchParams.set('payment', String(params.payment));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get(`${PAYMENT_CONSTANTS.REFUNDS.LIST}${query ? `?${query}` : ''}`);
  },

  retrieve: async (id: number | string): Promise<any> => {
    return apiService.get(PAYMENT_CONSTANTS.REFUNDS.DETAIL(id));
  },

  approve: async (id: number | string): Promise<any> => {
    return apiService.post(PAYMENT_CONSTANTS.REFUNDS.APPROVE(id), {});
  },

  reject: async (id: number | string, reason: string): Promise<any> => {
    return apiService.post(PAYMENT_CONSTANTS.REFUNDS.REJECT(id), { reason });
  },
};
