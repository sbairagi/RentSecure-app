import { apiService } from '@/services/api/apiClient';
import type {
  CollectRentPayload,
  ExportPaymentsPayload,
  GenerateInvoicePayload,
  Payment,
  PaymentAnalytics,
  PaymentFilters,
  PaymentListResponse,
  PaymentLink,
  PaymentSummary,
  PaymentTimelineEntry,
  RefundPayload,
  RetryPaymentPayload,
} from '../types/payments';
import type { BulkReminderPayload, PaymentReminder } from '../types/reminders';
import { PAYMENT_CONSTANTS } from '../constants/payments';

export const paymentsApi = {
  list: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
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
    return apiService.get<PaymentListResponse>(
      `${PAYMENT_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Payment> => {
    return apiService.get<Payment>(PAYMENT_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: Partial<Payment>): Promise<Payment> => {
    return apiService.post<Payment>(PAYMENT_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: Partial<Payment>): Promise<Payment> => {
    return apiService.patch<Payment>(PAYMENT_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(PAYMENT_CONSTANTS.API.DELETE(id));
  },

  initiate: async (data: {
    rent_record_id: number;
    payment_method: string;
    amount: string;
  }): Promise<{ order_id: string; payment_link: string; amount: string }> => {
    return apiService.post(PAYMENT_CONSTANTS.API.INITIATE, data);
  },

  verify: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ status: string; payment: Payment }> => {
    return apiService.post(PAYMENT_CONSTANTS.API.VERIFY, data);
  },

  refund: async (id: number | string, data: RefundPayload): Promise<Payment> => {
    return apiService.post<Payment>(PAYMENT_CONSTANTS.API.REFUND(id), data);
  },

  getHistory: async (params?: { renter?: number; page?: number }): Promise<PaymentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<PaymentListResponse>(
      `${PAYMENT_CONSTANTS.API.HISTORY}${query ? `?${query}` : ''}`
    );
  },

  getOverdue: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    const query = searchParams.toString();
    return apiService.get<PaymentListResponse>(
      `${PAYMENT_CONSTANTS.API.OVERDUE}${query ? `?${query}` : ''}`
    );
  },

  getPending: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    const query = searchParams.toString();
    return apiService.get<PaymentListResponse>(
      `${PAYMENT_CONSTANTS.API.PENDING}${query ? `?${query}` : ''}`
    );
  },

  getFailed: async (params?: PaymentFilters): Promise<PaymentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    const query = searchParams.toString();
    return apiService.get<PaymentListResponse>(
      `${PAYMENT_CONSTANTS.API.FAILED}${query ? `?${query}` : ''}`
    );
  },

  getAnalytics: async (params?: { period?: string; building?: number }): Promise<PaymentAnalytics> => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.building) searchParams.set('building', String(params.building));
    const query = searchParams.toString();
    return apiService.get<PaymentAnalytics>(
      `${PAYMENT_CONSTANTS.API.ANALYTICS}${query ? `?${query}` : ''}`
    );
  },

  getSummary: async (params?: { period?: string; building?: number }): Promise<PaymentSummary> => {
    const searchParams = new URLSearchParams();
    if (params?.period) searchParams.set('period', params.period);
    if (params?.building) searchParams.set('building', String(params.building));
    const query = searchParams.toString();
    return apiService.get<PaymentSummary>(
      `${PAYMENT_CONSTANTS.API.LIST}summary/${query ? `?${query}` : ''}`
    );
  },

  getTimeline: async (id: number | string): Promise<PaymentTimelineEntry[]> => {
    return apiService.get<PaymentTimelineEntry[]>(PAYMENT_CONSTANTS.API.TIMELINE(id));
  },

  retry: async (id: number | string, data?: RetryPaymentPayload): Promise<Payment> => {
    return apiService.post<Payment>(PAYMENT_CONSTANTS.API.RETRY(id), data || {});
  },

  cancel: async (id: number | string, reason?: string): Promise<Payment> => {
    return apiService.post<Payment>(PAYMENT_CONSTANTS.API.CANCEL(id), { reason });
  },

  bulkRetry: async (data: { payment_ids: number[]; reason?: string }): Promise<{ retried: number; failed: number }> => {
    return apiService.post(PAYMENT_CONSTANTS.API.BULK_RETRY, data);
  },

  bulkCancel: async (data: { payment_ids: number[]; reason: string }): Promise<{ cancelled: number; failed: number }> => {
    return apiService.post(PAYMENT_CONSTANTS.API.BULK_CANCEL, data);
  },

  getPaymentLink: async (id: number | string): Promise<PaymentLink> => {
    return apiService.get<PaymentLink>(PAYMENT_CONSTANTS.API.PAYMENT_LINK(id));
  },

  regenerateLink: async (id: number | string): Promise<PaymentLink> => {
    return apiService.post<PaymentLink>(PAYMENT_CONSTANTS.API.REGENERATE_LINK(id), {});
  },

  getQrCode: async (id: number | string): Promise<{ qr_code: string }> => {
    return apiService.get(PAYMENT_CONSTANTS.API.QR_CODE(id));
  },

  sendReminder: async (id: number | string, data: { reminder_types: string[]; message?: string }): Promise<PaymentReminder> => {
    return apiService.post<PaymentReminder>(PAYMENT_CONSTANTS.API.SEND_REMINDER(id), data);
  },

  bulkReminder: async (data: BulkReminderPayload): Promise<{ sent: number; failed: number }> => {
    return apiService.post(PAYMENT_CONSTANTS.API.BULK_REMINDER, data);
  },

  getReminderHistory: async (id: number | string): Promise<PaymentReminder[]> => {
    return apiService.get<PaymentReminder[]>(PAYMENT_CONSTANTS.API.REMINDER_HISTORY(id));
  },

  collectRent: async (data: CollectRentPayload): Promise<Payment> => {
    return apiService.post<Payment>(PAYMENT_CONSTANTS.API.COLLECT, data);
  },

  getReceipts: async (params?: { renter?: number; page?: number }): Promise<PaymentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<PaymentListResponse>(
      `${PAYMENT_CONSTANTS.API.RECEIPTS}${query ? `?${query}` : ''}`
    );
  },

  getReceipt: async (id: number | string): Promise<{ receipt_url: string }> => {
    return apiService.get(PAYMENT_CONSTANTS.API.RECEIPT_DETAIL(id));
  },

  exportPayments: async (data: ExportPaymentsPayload): Promise<Blob> => {
    const searchParams = new URLSearchParams();
    searchParams.set('format', data.format);
    if (data.payment_ids && data.payment_ids.length > 0) {
      searchParams.set('ids', data.payment_ids.join(','));
    }
    if (data.filters) {
      Object.entries(data.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.set(key, String(value));
        }
      });
    }
    const url = `${PAYMENT_CONSTANTS.API.EXPORT}?${searchParams.toString()}`;
    const token = await getAuthToken();
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },
};

async function getAuthToken(): Promise<string | null> {
  try {
    const { MMKV } = await import('react-native-mmkv');
    const mmkv = new MMKV();
    return mmkv.getString('access_token') ?? null;
  } catch {
    return null;
  }
}
