import { apiService } from '@/services/api/apiClient';
import { API_CONFIG } from '@/services/api/endpoints';
import { UNIT_CONSTANTS } from '../constants/unitConstants';
import type {
  BulkOperationPayload,
  FeatureAccess,
  SubscriptionLimits,
  Unit,
  UnitAnalytics,
  UnitCreatePayload,
  UnitDocument,
  UnitFilters,
  UnitImage,
  UnitListResponse,
  UnitOccupancyStats,
  UnitTimelineEntry,
  UnitUpdatePayload,
} from '../types/units';

export const unitsApi = {
  list: async (params?: UnitFilters): Promise<UnitListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.city) searchParams.set('city', params.city);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.unit_type) searchParams.set('unit_type', params.unit_type);
    if (params?.is_archived !== undefined)
      searchParams.set('is_archived', String(params.is_archived));
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<UnitListResponse>(
      `${UNIT_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Unit> => {
    return apiService.get<Unit>(UNIT_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: UnitCreatePayload): Promise<Unit> => {
    return apiService.post<Unit>(UNIT_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: UnitUpdatePayload): Promise<Unit> => {
    return apiService.patch<Unit>(UNIT_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(UNIT_CONSTANTS.API.DELETE(id));
  },

  getOccupancyStats: async (): Promise<UnitOccupancyStats> => {
    return apiService.get<UnitOccupancyStats>(UNIT_CONSTANTS.API.OCCUPANCY_STATS);
  },

  getAnalytics: async (): Promise<UnitAnalytics> => {
    return apiService.get<UnitAnalytics>(UNIT_CONSTANTS.API.ANALYTICS);
  },

  getTimeline: async (id: number | string): Promise<UnitTimelineEntry[]> => {
    return apiService.get<UnitTimelineEntry[]>(UNIT_CONSTANTS.API.TIMELINE(id));
  },

  getQrCode: async (id: number | string): Promise<{ qr_code_url: string }> => {
    return apiService.get<{ qr_code_url: string }>(UNIT_CONSTANTS.API.QR_CODE(id));
  },

  getSubscriptionLimits: async (): Promise<SubscriptionLimits> => {
    return apiService.get<SubscriptionLimits>('/api/subscription/limits/');
  },

  getFeatureAccess: async (): Promise<FeatureAccess> => {
    return apiService.get<FeatureAccess>('/api/subscription/feature-access/');
  },

  bulkUpdate: async (payload: BulkOperationPayload): Promise<{ updated: number }> => {
    return apiService.post<{ updated: number }>(UNIT_CONSTANTS.API.BULK.UPDATE, payload);
  },

  bulkDelete: async (unitIds: number[]): Promise<{ deleted: number }> => {
    return apiService.post<{ deleted: number }>(UNIT_CONSTANTS.API.BULK.UPDATE, {
      unit_ids: unitIds,
      action: 'delete',
    });
  },

  exportUnits: async (format: 'csv' | 'xlsx', unitIds?: number[]): Promise<Blob> => {
    const searchParams = new URLSearchParams();
    searchParams.set('format', format);
    if (unitIds && unitIds.length > 0) {
      searchParams.set('ids', unitIds.join(','));
    }
    const url = `${UNIT_CONSTANTS.API.BULK.EXPORT}?${searchParams.toString()}`;
    const token = await getAuthToken();
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },

  importUnits: async (
    file: File
  ): Promise<{ imported: number; failed: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.upload<{ imported: number; failed: number; errors: string[] }>(
      UNIT_CONSTANTS.API.BULK.IMPORT,
      formData
    );
  },

  uploadImage: async (
    unitId: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UnitImage> => {
    const formData = new FormData();
    formData.append('unit', String(unitId));
    formData.append('image', file);
    return apiService.upload<UnitImage>(UNIT_CONSTANTS.API.IMAGES.UPLOAD, formData, onProgress);
  },

  deleteImage: async (imageId: number | string): Promise<void> => {
    return apiService.delete<void>(UNIT_CONSTANTS.API.IMAGES.DELETE(imageId));
  },

  uploadDocument: async (
    unitId: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UnitDocument> => {
    const formData = new FormData();
    formData.append('unit', String(unitId));
    formData.append('document', file);
    return apiService.upload<UnitDocument>(
      UNIT_CONSTANTS.API.DOCUMENTS.UPLOAD,
      formData,
      onProgress
    );
  },

  deleteDocument: async (documentId: number | string): Promise<void> => {
    return apiService.delete<void>(UNIT_CONSTANTS.API.DOCUMENTS.DELETE(documentId));
  },

  assignRenter: async (unitId: number, renterId: number): Promise<Unit> => {
    return apiService.post<Unit>(`/api/renters/${renterId}/assign-unit/`, { unit_id: unitId });
  },

  assignCaretaker: async (
    unitId: number,
    caretakerData: { name: string; phone: string; email?: string }
  ): Promise<{ id: number }> => {
    return apiService.post<{ id: number }>(UNIT_CONSTANTS.API.CARETAKERS.LIST, {
      unit: unitId,
      ...caretakerData,
    });
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
