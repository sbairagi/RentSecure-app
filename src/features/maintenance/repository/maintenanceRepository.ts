import { maintenanceApi } from '../services/maintenanceApi';
import type {
  MaintenanceCommentPayload,
  MaintenanceCreatePayload,
  MaintenanceDetailResponse,
  MaintenanceExpensePayload,
  MaintenanceFilters,
  MaintenanceListResponse,
  MaintenanceUpdatePayload,
} from '../types/maintenance';

export const maintenanceRepository = {
  fetchMaintenanceRequests: async (params?: MaintenanceFilters): Promise<MaintenanceListResponse> => {
    return maintenanceApi.list(params);
  },

  fetchMaintenanceRequest: async (id: number | string): Promise<MaintenanceDetailResponse> => {
    return maintenanceApi.retrieve(id);
  },

  createMaintenanceRequest: async (data: MaintenanceCreatePayload): Promise<MaintenanceDetailResponse> => {
    return maintenanceApi.create(data);
  },

  updateMaintenanceRequest: async (
    id: number | string,
    data: MaintenanceUpdatePayload
  ): Promise<MaintenanceDetailResponse> => {
    return maintenanceApi.update(id, data);
  },

  deleteMaintenanceRequest: async (id: number | string): Promise<void> => {
    return maintenanceApi.remove(id);
  },

  fetchDashboard: async (): Promise<any> => {
    return maintenanceApi.getDashboard();
  },

  updateStatus: async (id: number | string, data: { status: string; resolution_notes?: string }): Promise<any> => {
    return maintenanceApi.updateStatus(id, data);
  },

  assignCaretaker: async (id: number | string, caretakerId: number): Promise<any> => {
    return maintenanceApi.assignCaretaker(id, caretakerId);
  },

  assignVendor: async (id: number | string, vendorId: number): Promise<any> => {
    return maintenanceApi.assignVendor(id, vendorId);
  },

  addComment: async (id: number | string, data: MaintenanceCommentPayload): Promise<any> => {
    return maintenanceApi.addComment(id, data);
  },

  fetchComments: async (id: number | string): Promise<any> => {
    return maintenanceApi.listComments(id);
  },

  addExpense: async (id: number | string, data: MaintenanceExpensePayload): Promise<any> => {
    return maintenanceApi.addExpense(id, data);
  },

  fetchExpenses: async (id: number | string): Promise<any> => {
    return maintenanceApi.listExpenses(id);
  },

  uploadPhoto: async (id: number | string, formData: FormData): Promise<any> => {
    return maintenanceApi.uploadPhoto(id, formData);
  },

  fetchPhotos: async (id: number | string): Promise<any> => {
    return maintenanceApi.listPhotos(id);
  },

  uploadDocument: async (id: number | string, formData: FormData): Promise<any> => {
    return maintenanceApi.uploadDocument(id, formData);
  },

  fetchDocuments: async (id: number | string): Promise<any> => {
    return maintenanceApi.listDocuments(id);
  },

  fetchTimeline: async (id: number | string): Promise<any> => {
    return maintenanceApi.getTimeline(id);
  },

  fetchResolved: async (params?: MaintenanceFilters): Promise<MaintenanceListResponse> => {
    return maintenanceApi.getResolved(params);
  },

  fetchClosed: async (params?: MaintenanceFilters): Promise<MaintenanceListResponse> => {
    return maintenanceApi.getClosed(params);
  },

  fetchVendors: async (): Promise<any> => {
    return maintenanceApi.getVendors();
  },

  fetchVendor: async (id: number | string): Promise<any> => {
    return maintenanceApi.getVendor(id);
  },
};
