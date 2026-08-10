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
    return apiClient.get(API_ENDPOINTS.RENTERS.RENT_RECORD_DETAIL(id));
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

  downloadInvoice: (rentId: number | string): Promise<Blob> => {
    return apiClient.get(API_ENDPOINTS.RENT_RECORDS.DETAIL(rentId) + 'invoice/', {
      responseType: 'blob',
    });
  },

  downloadAgreement: (agreementId: number | string): Promise<Blob> => {
    const rootUrl = getRootUrl();
    return apiClient.get(`${rootUrl}/documents/document/rent_agreement/${agreementId}/generate-rent-agreement-pdf/`, {
      responseType: 'blob',
    });
  },
};