import { apiService } from '@/services/api/apiClient';
import type {
  CreateRentPaymentPayload,
  CreateRentPaymentResponse,
  RentFilters,
  RentListResponse,
  RentOverviewItem,
  RenterDueRent,
  RenterRentHistoryItem,
  RetryPayoutResponse,
  RentRecord,
  RentRecordCreatePayload,
  RentRecordUpdatePayload,
  VerifyRentPaymentPayload,
  VerifyRentPaymentResponse,
} from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';

export const rentsApi = {
  list: async (params?: RentFilters): Promise<RentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.payment_method) searchParams.set('payment_method', params.payment_method);
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.date_from) searchParams.set('date_from', params.date_from);
    if (params?.date_to) searchParams.set('date_to', params.date_to);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    const query = searchParams.toString();
    return apiService.get<RentListResponse>(
      `${RENT_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<RentRecord> => {
    return apiService.get<RentRecord>(RENT_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: RentRecordCreatePayload): Promise<RentRecord> => {
    return apiService.post<RentRecord>(RENT_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: RentRecordUpdatePayload): Promise<RentRecord> => {
    return apiService.patch<RentRecord>(RENT_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(RENT_CONSTANTS.API.DELETE(id));
  },

  getMonthlySummary: async (): Promise<{
    month: string;
    collected_amount: string;
    collected_count: number;
    pending_count: number;
  }> => {
    return apiService.get(RENT_CONSTANTS.API.MONTHLY_SUMMARY);
  },

  getItrSummary: async (): Promise<{
    fy: string;
    total_rent: string;
    record_count: number;
  }> => {
    return apiService.get(RENT_CONSTANTS.API.ITR_SUMMARY);
  },

  sendItrSummary: async (): Promise<{ message: string }> => {
    return apiService.post(RENT_CONSTANTS.API.SEND_ITR_SUMMARY, {});
  },

  downloadItrSummary: async (): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(RENT_CONSTANTS.API.DOWNLOAD_ITR_SUMMARY, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Failed to download ITR summary');
    return response.blob();
  },

  downloadInvoice: async (id: number | string): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(RENT_CONSTANTS.API.INVOICE(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Failed to download invoice');
    return response.blob();
  },

  resendConfirmation: async (id: number | string): Promise<{ status: string }> => {
    return apiService.post(RENT_CONSTANTS.API.RESEND_CONFIRMATION(id), {});
  },

  getOwnerRecords: async (): Promise<RentRecord[]> => {
    return apiService.get<RentRecord[]>(RENT_CONSTANTS.API.OWNER_LIST);
  },

  getOwnerOverview: async (): Promise<RentOverviewItem[]> => {
    return apiService.get<RentOverviewItem[]>(RENT_CONSTANTS.API.OWNER_OVERVIEW);
  },

  retryPayout: async (id: number | string): Promise<RetryPayoutResponse> => {
    return apiService.post(RENT_CONSTANTS.API.RETRY_PAYOUT(id), {});
  },

  getRenterDueRent: async (): Promise<RenterDueRent> => {
    return apiService.get<RenterDueRent>(RENT_CONSTANTS.API.RENTER_DUE);
  },

  getRenterHistory: async (): Promise<RenterRentHistoryItem[]> => {
    return apiService.get<RenterRentHistoryItem[]>(RENT_CONSTANTS.API.RENTER_HISTORY);
  },

  getRenterRecords: async (params?: { page?: number; limit?: number }): Promise<{
    data: RentRecord[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return apiService.get(
      `${RENT_CONSTANTS.API.RENTER_LIST}${query ? `?${query}` : ''}`
    );
  },

  getRenterRecordDetail: async (id: number | string): Promise<RentRecord> => {
    return apiService.get<RentRecord>(RENT_CONSTANTS.API.RENTER_DETAIL(id));
  },

  createPayment: async (data: CreateRentPaymentPayload): Promise<CreateRentPaymentResponse> => {
    return apiService.post(RENT_CONSTANTS.PAYMENT.CREATE, data);
  },

  verifyPayment: async (data: VerifyRentPaymentPayload): Promise<VerifyRentPaymentResponse> => {
    return apiService.post(RENT_CONSTANTS.PAYMENT.VERIFY, data);
  },
};

async function getAuthToken(): Promise<string | null> {
  try {
    const { secureStorage } = await import('@/services/storage/secureStorage');
    return await secureStorage.getAccessToken();
  } catch {
    return null;
  }
}
