import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG, API_ENDPOINTS } from '@/services/api/endpoints';
import type {
  RenterDashboard,
  RenterRentRecord,
  RenterRentRecordsResponse,
  RenterAgreement,
  RenterDocument,
  RenterExtraCharge,
  RenterExtraChargesResponse,
  RenterProfile,
} from '../types/renterDashboard';

const getRootUrl = () => {
  const base = API_CONFIG.BASE_URL.replace(/\/$/, '');
  return base.replace(/\/api\/?$/, '');
};

export const renterDashboardApi = {
  getDashboard: (): Promise<RenterDashboard> => {
    return apiClient.get(API_ENDPOINTS.RENTERS.DASHBOARD);
  },

  getProfile: (): Promise<RenterProfile> => {
    return apiClient.get(API_ENDPOINTS.RENTERS.PROFILE);
  },

  getRentRecords: (params?: { page?: number; limit?: number }): Promise<RenterRentRecordsResponse> => {
    return apiClient.get(API_ENDPOINTS.RENTERS.RENT_RECORDS, { params });
  },

  getRentRecordDetail: (id: number | string): Promise<RenterRentRecord> => {
    return apiClient.get(API_ENDPOINTS.RENTERS.RENT_RECORD_DETAIL(String(id)));
  },

  getAgreement: (): Promise<RenterAgreement> => {
    return apiClient.get(API_ENDPOINTS.RENTERS.AGREEMENT);
  },

  getDocuments: (): Promise<RenterDocument> => {
    return apiClient.get(API_ENDPOINTS.RENTERS.DOCUMENTS);
  },

  getExtraCharges: (params?: { page?: number; limit?: number }): Promise<RenterExtraChargesResponse> => {
    return apiClient.get(API_ENDPOINTS.RENTERS.EXTRA_CHARGES, { params });
  },

  initiateRentPayment: (rentId: number | string): Promise<{
    order_id: string;
    amount: string;
    currency: string;
    key_id: string;
    rent_id: number;
  }> => {
    return apiClient.post('/api/rent/payment/', { rent_id: rentId });
  },

  verifyRentPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{
    status: string;
    message: string;
    rent_id: number;
    payment_status: string;
    paid_on?: string;
  }> => {
    return apiClient.post('/api/rent/verify-payment/', data);
  },

  downloadInvoice: (rentId: number | string): Promise<Blob> => {
    const rootUrl = getRootUrl();
    return apiClient.get(`${rootUrl}/rent-records/${rentId}/invoice/`, {
      responseType: 'blob',
    });
  },
};