import { rentsApi } from '../services/rentsApi';
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

export const rentsRepository = {
  fetchRentRecords: async (params?: RentFilters): Promise<RentListResponse> => {
    return rentsApi.list(params);
  },

  fetchRentRecord: async (id: number | string): Promise<RentRecord> => {
    return rentsApi.retrieve(id);
  },

  createRentRecord: async (data: RentRecordCreatePayload): Promise<RentRecord> => {
    return rentsApi.create(data);
  },

  updateRentRecord: async (id: number | string, data: RentRecordUpdatePayload): Promise<RentRecord> => {
    return rentsApi.update(id, data);
  },

  deleteRentRecord: async (id: number | string): Promise<void> => {
    return rentsApi.remove(id);
  },

  fetchMonthlySummary: async (): Promise<{
    month: string;
    collected_amount: string;
    collected_count: number;
    pending_count: number;
  }> => {
    return rentsApi.getMonthlySummary();
  },

  fetchItrSummary: async (): Promise<{
    fy: string;
    total_rent: string;
    record_count: number;
  }> => {
    return rentsApi.getItrSummary();
  },

  sendItrSummary: async (): Promise<{ message: string }> => {
    return rentsApi.sendItrSummary();
  },

  downloadItrSummary: async (): Promise<Blob> => {
    return rentsApi.downloadItrSummary();
  },

  downloadInvoice: async (id: number | string): Promise<Blob> => {
    return rentsApi.downloadInvoice(id);
  },

  resendConfirmation: async (id: number | string): Promise<{ status: string }> => {
    return rentsApi.resendConfirmation(id);
  },

  fetchOwnerRecords: async (): Promise<RentRecord[]> => {
    return rentsApi.getOwnerRecords();
  },

  fetchOwnerOverview: async (): Promise<RentOverviewItem[]> => {
    return rentsApi.getOwnerOverview();
  },

  retryPayout: async (id: number | string): Promise<RetryPayoutResponse> => {
    return rentsApi.retryPayout(id);
  },

  fetchRenterDueRent: async (): Promise<RenterDueRent> => {
    return rentsApi.getRenterDueRent();
  },

  fetchRenterHistory: async (): Promise<RenterRentHistoryItem[]> => {
    return rentsApi.getRenterHistory();
  },

  fetchRenterRecords: async (params?: { page?: number; limit?: number }): Promise<{
    data: RentRecord[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    return rentsApi.getRenterRecords(params);
  },

  fetchRenterRecordDetail: async (id: number | string): Promise<RentRecord> => {
    return rentsApi.getRenterRecordDetail(id);
  },

  createPayment: async (data: CreateRentPaymentPayload): Promise<CreateRentPaymentResponse> => {
    return rentsApi.createPayment(data);
  },

  verifyPayment: async (data: VerifyRentPaymentPayload): Promise<VerifyRentPaymentResponse> => {
    return rentsApi.verifyPayment(data);
  },
};
