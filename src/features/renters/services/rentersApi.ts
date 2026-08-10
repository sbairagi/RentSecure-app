import { apiService } from '@/services/api/apiClient';
import { API_CONFIG } from '@/services/api/endpoints';
import { RENTER_CONSTANTS } from '../constants/renters';
import type {
  BootstrapData,
  Building,
  ExtraCharge,
  KycDocument,
  Notification,
  PoliceVerification,
  Renter,
  RenterActivity,
  RenterAgreement,
  RenterAssignUnitPayload,
  RenterBulkNotifyPayload,
  RenterCreatePayload,
  RenterDocument,
  RenterFilters,
  RenterListResponse,
  RenterNote,
  RenterStatusSummary,
  RenterTimelineEntry,
  RenterTransferUnitPayload,
  RenterUpdatePayload,
  RentRecord,
  SubscriptionLimits,
  Unit,
} from '../types/renters';

export const rentersApi = {
  list: async (params?: RenterFilters): Promise<RenterListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<RenterListResponse>(
      `${RENTER_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Renter> => {
    return apiService.get<Renter>(RENTER_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: RenterCreatePayload): Promise<Renter> => {
    return apiService.post<Renter>(RENTER_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: RenterUpdatePayload): Promise<Renter> => {
    return apiService.patch<Renter>(RENTER_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(RENTER_CONSTANTS.API.DELETE(id));
  },

  rate: async (id: number | string, rating: number, review?: string): Promise<Renter> => {
    return apiService.post<Renter>(RENTER_CONSTANTS.API.RATE(id), { rating, review });
  },

  updateStatus: async (id: number | string, status: string): Promise<Renter> => {
    return apiService.post<Renter>(RENTER_CONSTANTS.API.UPDATE_STATUS(id), { status });
  },

  vacate: async (id: number | string, end_date?: string): Promise<Renter> => {
    return apiService.post<Renter>(RENTER_CONSTANTS.API.VACATE(id), { end_date });
  },

  getStatusSummary: async (): Promise<RenterStatusSummary> => {
    return apiService.get<RenterStatusSummary>(RENTER_CONSTANTS.API.STATUS_SUMMARY);
  },

  getRecentActivity: async (): Promise<RenterActivity[]> => {
    return apiService.get<RenterActivity[]>(RENTER_CONSTANTS.API.RECENT_ACTIVITY);
  },

  getTimeline: async (id: number | string): Promise<RenterTimelineEntry[]> => {
    return apiService.get<RenterTimelineEntry[]>(RENTER_CONSTANTS.API.TIMELINE(id));
  },

  assignUnit: async (id: number | string, payload: RenterAssignUnitPayload): Promise<Renter> => {
    return apiService.post<Renter>(RENTER_CONSTANTS.API.ASSIGN_UNIT(id), payload);
  },

  transferUnit: async (
    id: number | string,
    payload: RenterTransferUnitPayload
  ): Promise<Renter> => {
    return apiService.post<Renter>(RENTER_CONSTANTS.API.TRANSFER_UNIT(id), payload);
  },

  getKycDocuments: async (renterId: number | string): Promise<KycDocument[]> => {
    return apiService.get<KycDocument[]>(RENTER_CONSTANTS.API.KYC_DOCUMENTS.LIST(renterId));
  },

  createKycDocument: async (
    renterId: number | string,
    data: FormData,
    onProgress?: (progress: number) => void
  ): Promise<KycDocument> => {
    return apiService.upload<KycDocument>(
      RENTER_CONSTANTS.API.KYC_DOCUMENTS.LIST(renterId),
      data,
      onProgress
    );
  },

  getKycDocument: async (id: number | string): Promise<KycDocument> => {
    return apiService.get<KycDocument>(RENTER_CONSTANTS.API.KYC_DOCUMENTS.DETAIL(id));
  },

  updateKycDocument: async (
    id: number | string,
    data: Partial<KycDocument>
  ): Promise<KycDocument> => {
    return apiService.patch<KycDocument>(RENTER_CONSTANTS.API.KYC_DOCUMENTS.DETAIL(id), data);
  },

  deleteKycDocument: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(RENTER_CONSTANTS.API.KYC_DOCUMENTS.DETAIL(id));
  },

  processKycOcr: async (id: number | string): Promise<{ extracted_text: string }> => {
    return apiService.post<{ extracted_text: string }>(
      RENTER_CONSTANTS.API.KYC_DOCUMENTS.OCR(id),
      {}
    );
  },

  getDocuments: async (renterId: number | string): Promise<RenterDocument[]> => {
    return apiService.get<RenterDocument[]>(RENTER_CONSTANTS.API.DOCUMENTS.LIST(renterId));
  },

  getNotes: async (renterId: number | string): Promise<RenterNote[]> => {
    return apiService.get<RenterNote[]>(RENTER_CONSTANTS.API.NOTES.LIST(renterId));
  },

  createNote: async (renterId: number | string, note: string): Promise<RenterNote> => {
    return apiService.post<RenterNote>(RENTER_CONSTANTS.API.NOTES.LIST(renterId), { note });
  },

  updateNote: async (id: number | string, note: string): Promise<RenterNote> => {
    return apiService.patch<RenterNote>(RENTER_CONSTANTS.API.NOTES.DETAIL(id), { note });
  },

  deleteNote: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(RENTER_CONSTANTS.API.NOTES.DETAIL(id));
  },

  bulkNotify: async (
    renterId: number | string,
    payload: RenterBulkNotifyPayload
  ): Promise<{ sent: number }> => {
    return apiService.post<{ sent: number }>(RENTER_CONSTANTS.API.BULK_NOTIFY(renterId), payload);
  },

  exportRenters: async (format: 'csv' | 'xlsx', renterIds?: number[]): Promise<Blob> => {
    const searchParams = new URLSearchParams();
    searchParams.set('format', format);
    if (renterIds && renterIds.length > 0) {
      searchParams.set('ids', renterIds.join(','));
    }
    const url = `${RENTER_CONSTANTS.API.EXPORT}?${searchParams.toString()}`;
    const token = await getAuthToken();
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },

  importRenters: async (
    file: File
  ): Promise<{ imported: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.upload<{ imported: number; failed: number; errors: string[] }>(
      RENTER_CONSTANTS.API.IMPORT,
      formData
    );
  },

  getRentRecords: async (renterId?: number | string): Promise<RentRecord[]> => {
    const url = renterId
      ? `${RENTER_CONSTANTS.API.RENT_RECORDS.LIST}?renter=${renterId}`
      : RENTER_CONSTANTS.API.RENT_RECORDS.LIST;
    return apiService.get<RentRecord[]>(url);
  },

  getExtraCharges: async (renterId?: number | string): Promise<ExtraCharge[]> => {
    const url = renterId
      ? `${RENTER_CONSTANTS.API.EXTRA_CHARGES}?renter=${renterId}`
      : RENTER_CONSTANTS.API.EXTRA_CHARGES;
    return apiService.get<ExtraCharge[]>(url);
  },

  getPoliceVerifications: async (renterId?: number | string): Promise<PoliceVerification[]> => {
    const url = renterId
      ? `${RENTER_CONSTANTS.API.POLICE_VERIFICATIONS.LIST}?renter=${renterId}`
      : RENTER_CONSTANTS.API.POLICE_VERIFICATIONS.LIST;
    return apiService.get<PoliceVerification[]>(url);
  },

  getAgreements: async (renterId?: number | string): Promise<RenterAgreement[]> => {
    const url = renterId
      ? `${RENTER_CONSTANTS.API.AGREEMENTS.LIST}?renter=${renterId}`
      : RENTER_CONSTANTS.API.AGREEMENTS.LIST;
    return apiService.get<RenterAgreement[]>(url);
  },

  getNotifications: async (): Promise<Notification[]> => {
    return apiService.get<Notification[]>(RENTER_CONSTANTS.API.NOTIFICATIONS.LIST);
  },

  markNotificationRead: async (id: number | string): Promise<void> => {
    return apiService.post<void>(RENTER_CONSTANTS.API.NOTIFICATIONS.MARK_READ(id), {});
  },

  getBootstrapData: async (): Promise<BootstrapData> => {
    return apiService.get<BootstrapData>(RENTER_CONSTANTS.API.BOOTSTRAP);
  },

  getSubscriptionLimits: async (): Promise<SubscriptionLimits> => {
    return apiService.get<SubscriptionLimits>(RENTER_CONSTANTS.API.USAGE_LIMITS);
  },

  getUnits: async (): Promise<Unit[]> => {
    return apiService.get<Unit[]>(RENTER_CONSTANTS.API.UNITS);
  },

  getBuildings: async (): Promise<Building[]> => {
    return apiService.get<Building[]>(RENTER_CONSTANTS.API.BUILDINGS);
  },

  generateRentAgreementPdf: async (id: number | string): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(RENTER_CONSTANTS.API.DOCUMENTS_PDF.RENT_AGREEMENT_PDF(id), {
      headers: {
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Failed to generate PDF');
    return response.blob();
  },

  generatePropertyDossierPdf: async (id: number | string): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(RENTER_CONSTANTS.API.DOCUMENTS_PDF.PROPERTIES_DOSSIER_PDF(id), {
      headers: {
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Failed to generate PDF');
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
