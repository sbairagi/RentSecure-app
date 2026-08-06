import { unitsApi } from '../services/unitsApi';
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

export const unitsRepository = {
  fetchUnits: async (params?: UnitFilters): Promise<UnitListResponse> => {
    return unitsApi.list(params);
  },

  fetchUnit: async (id: number | string): Promise<Unit> => {
    return unitsApi.retrieve(id);
  },

  createUnit: async (data: UnitCreatePayload): Promise<Unit> => {
    return unitsApi.create(data);
  },

  updateUnit: async (id: number | string, data: UnitUpdatePayload): Promise<Unit> => {
    return unitsApi.update(id, data);
  },

  deleteUnit: async (id: number | string): Promise<void> => {
    return unitsApi.remove(id);
  },

  fetchOccupancyStats: async (): Promise<UnitOccupancyStats> => {
    return unitsApi.getOccupancyStats();
  },

  fetchAnalytics: async (): Promise<UnitAnalytics> => {
    return unitsApi.getAnalytics();
  },

  fetchTimeline: async (id: number | string): Promise<UnitTimelineEntry[]> => {
    return unitsApi.getTimeline(id);
  },

  fetchQrCode: async (id: number | string): Promise<{ qr_code_url: string }> => {
    return unitsApi.getQrCode(id);
  },

  fetchSubscriptionLimits: async (): Promise<SubscriptionLimits> => {
    return unitsApi.getSubscriptionLimits();
  },

  fetchFeatureAccess: async (): Promise<FeatureAccess> => {
    return unitsApi.getFeatureAccess();
  },

  bulkUpdate: async (payload: BulkOperationPayload): Promise<{ updated: number }> => {
    return unitsApi.bulkUpdate(payload);
  },

  bulkDelete: async (unitIds: number[]): Promise<{ deleted: number }> => {
    return unitsApi.bulkDelete(unitIds);
  },

  exportUnits: async (format: 'csv' | 'xlsx', unitIds?: number[]): Promise<Blob> => {
    return unitsApi.exportUnits(format, unitIds);
  },

  importUnits: async (
    file: File
  ): Promise<{ imported: number; failed: number; errors: string[] }> => {
    return unitsApi.importUnits(file);
  },

  uploadImage: async (
    unitId: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UnitImage> => {
    return unitsApi.uploadImage(unitId, file, onProgress);
  },

  deleteImage: async (imageId: number | string): Promise<void> => {
    return unitsApi.deleteImage(imageId);
  },

  uploadDocument: async (
    unitId: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UnitDocument> => {
    return unitsApi.uploadDocument(unitId, file, onProgress);
  },

  deleteDocument: async (documentId: number | string): Promise<void> => {
    return unitsApi.deleteDocument(documentId);
  },

  assignRenter: async (unitId: number, renterId: number): Promise<Unit> => {
    return unitsApi.assignRenter(unitId, renterId);
  },

  assignCaretaker: async (
    unitId: number,
    caretakerData: { name: string; phone: string; email?: string }
  ): Promise<{ id: number }> => {
    return unitsApi.assignCaretaker(unitId, caretakerData);
  },
};
