import { apiService } from '@/services/api/apiClient';
import { API_CONFIG } from '@/services/api/endpoints';
import { AGREEMENT_CONSTANTS } from '../constants/agreements';
import type {
  Agreement,
  AgreementCreatePayload,
  AgreementDocument,
  AgreementFilters,
  AgreementListResponse,
  AgreementStatusSummary,
  AgreementTimelineEntry,
  AgreementUpdatePayload,
  AgreementWithRelations,
  AgreementWitness,
  BootstrapData,
  FeatureAccess,
  SubscriptionLimits,
} from '../types/agreements';

export const agreementsApi = {
  list: async (params?: AgreementFilters): Promise<AgreementListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.is_signed !== undefined) searchParams.set('is_signed', String(params.is_signed));
    if (params?.date_from) searchParams.set('date_from', params.date_from);
    if (params?.date_to) searchParams.set('date_to', params.date_to);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<AgreementListResponse>(
      `${AGREEMENT_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Agreement> => {
    return apiService.get<Agreement>(AGREEMENT_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: AgreementCreatePayload): Promise<Agreement> => {
    return apiService.post<Agreement>(AGREEMENT_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: AgreementUpdatePayload): Promise<Agreement> => {
    return apiService.patch<Agreement>(AGREEMENT_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(AGREEMENT_CONSTANTS.API.DELETE(id));
  },

  sendForSignature: async (id: number | string): Promise<Agreement> => {
    return apiService.post<Agreement>(AGREEMENT_CONSTANTS.API.SEND_FOR_SIGNATURE(id), {});
  },

  generatePDF: async (id: number | string): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(AGREEMENT_CONSTANTS.API.GENERATE_PDF(id), {
      headers: {
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Failed to generate PDF');
    return response.blob();
  },

  getDocuments: async (agreementId: number | string): Promise<AgreementDocument[]> => {
    return apiService.get<AgreementDocument[]>(AGREEMENT_CONSTANTS.API.DOCUMENTS.LIST(agreementId));
  },

  uploadDocument: async (
    agreementId: number | string,
    data: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AgreementDocument> => {
    return apiService.upload<AgreementDocument>(
      AGREEMENT_CONSTANTS.API.DOCUMENTS.UPLOAD(agreementId),
      data,
      onProgress
    );
  },

  getTimeline: async (agreementId: number | string): Promise<AgreementTimelineEntry[]> => {
    return apiService.get<AgreementTimelineEntry[]>(AGREEMENT_CONSTANTS.API.TIMELINE(agreementId));
  },

  getWitnesses: async (agreementId: number | string): Promise<AgreementWitness[]> => {
    return apiService.get<AgreementWitness[]>(AGREEMENT_CONSTANTS.API.WITNESSES.LIST(agreementId));
  },

  addWitness: async (
    agreementId: number | string,
    witness: Partial<AgreementWitness>
  ): Promise<AgreementWitness> => {
    return apiService.post<AgreementWitness>(
      AGREEMENT_CONSTANTS.API.WITNESSES.LIST(agreementId),
      witness
    );
  },

  getTemplates: async (): Promise<Agreement[]> => {
    return apiService.get<Agreement[]>(AGREEMENT_CONSTANTS.API.TEMPLATES);
  },

  getStatusSummary: async (): Promise<AgreementStatusSummary> => {
    return apiService.get<AgreementStatusSummary>(AGREEMENT_CONSTANTS.API.STATUS_SUMMARY);
  },

  getRecentActivity: async (): Promise<AgreementTimelineEntry[]> => {
    return apiService.get<AgreementTimelineEntry[]>(
      AGREEMENT_CONSTANTS.API.RECENT_ACTIVITY
    );
  },

  getBootstrapData: async (): Promise<BootstrapData> => {
    return apiService.get<BootstrapData>(AGREEMENT_CONSTANTS.API.BOOTSTRAP);
  },

  getSubscriptionLimits: async (): Promise<SubscriptionLimits> => {
    return apiService.get<SubscriptionLimits>(AGREEMENT_CONSTANTS.API.USAGE_LIMITS);
  },

  getRenters: async (): Promise<{ id: number; name: string }[]> => {
    return apiService.get<{ id: number; name: string }[]>(AGREEMENT_CONSTANTS.API.RENTERS);
  },

  getBuildings: async (): Promise<{ id: number; name: string }[]> => {
    return apiService.get<{ id: number; name: string }[]>(AGREEMENT_CONSTANTS.API.BUILDINGS);
  },

  getUnits: async (): Promise<{ id: number; unit: string; building_name: string }[]> => {
    return apiService.get<{ id: number; unit: string; building_name: string }[]>(
      AGREEMENT_CONSTANTS.API.UNITS
    );
  },

  getNotifications: async (): Promise<any[]> => {
    return apiService.get<any[]>(AGREEMENT_CONSTANTS.API.NOTIFICATIONS.LIST);
  },

  markNotificationRead: async (id: number | string): Promise<void> => {
    return apiService.post<void>(AGREEMENT_CONSTANTS.API.NOTIFICATIONS.MARK_READ(id), {});
  },

  getFeatureAccess: async (): Promise<FeatureAccess> => {
    const data = await agreementsApi.getBootstrapData();
    return data.feature_access;
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
