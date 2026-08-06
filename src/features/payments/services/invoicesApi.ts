import { apiService } from '@/services/api/apiClient';
import type { GenerateInvoicePayload } from '../types/payments';
import type { Invoice, InvoiceListResponse, InvoiceSummary } from '../types/invoices';
import { PAYMENT_CONSTANTS } from '../constants/payments';

export const invoicesApi = {
  list: async (params?: { status?: string; search?: string; page?: number; page_size?: number }): Promise<InvoiceListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    const query = searchParams.toString();
    return apiService.get<InvoiceListResponse>(
      `${PAYMENT_CONSTANTS.INVOICES.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Invoice> => {
    return apiService.get<Invoice>(PAYMENT_CONSTANTS.INVOICES.DETAIL(id));
  },

  create: async (data: GenerateInvoicePayload): Promise<Invoice> => {
    return apiService.post<Invoice>(PAYMENT_CONSTANTS.INVOICES.CREATE, data);
  },

  update: async (id: number | string, data: Partial<Invoice>): Promise<Invoice> => {
    return apiService.patch<Invoice>(PAYMENT_CONSTANTS.INVOICES.UPDATE(id), data);
  },

  delete: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(PAYMENT_CONSTANTS.INVOICES.DELETE(id));
  },

  download: async (id: number | string): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(PAYMENT_CONSTANTS.INVOICES.DOWNLOAD(id), {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  },

  send: async (id: number | string, data?: { send_via?: string[] }): Promise<{ status: string }> => {
    return apiService.post(PAYMENT_CONSTANTS.INVOICES.SEND(id), data || {});
  },

  markPaid: async (id: number | string, data?: { payment_id?: number }): Promise<Invoice> => {
    return apiService.post<Invoice>(PAYMENT_CONSTANTS.INVOICES.MARK_PAID(id), data || {});
  },

  preview: async (id: number | string): Promise<{ pdf_url: string }> => {
    return apiService.get(PAYMENT_CONSTANTS.INVOICES.PREVIEW(id));
  },

  share: async (id: number | string, data: { send_via: string[] }): Promise<{ status: string }> => {
    return apiService.post(PAYMENT_CONSTANTS.INVOICES.SHARE(id), data);
  },

  search: async (query: string): Promise<InvoiceListResponse> => {
    return apiService.get<InvoiceListResponse>(`${PAYMENT_CONSTANTS.INVOICES.SEARCH}?q=${encodeURIComponent(query)}`);
  },

  getStats: async (): Promise<InvoiceSummary> => {
    return apiService.get<InvoiceSummary>(PAYMENT_CONSTANTS.INVOICES.STATS);
  },

  bulkGenerate: async (data: GenerateInvoicePayload): Promise<{ generated: number; failed: number }> => {
    return apiService.post(PAYMENT_CONSTANTS.INVOICES.BULK_GENERATE, data);
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
