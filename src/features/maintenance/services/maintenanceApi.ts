import { apiService } from '@/services/api/apiClient';
import { MAINTENANCE_CONSTANTS } from '../constants/maintenanceConstants';
import type {
  MaintenanceCreatePayload,
  MaintenanceDetailResponse,
  MaintenanceFilters,
  MaintenanceListResponse,
  MaintenanceUpdatePayload,
  MaintenanceCommentPayload,
  MaintenanceExpensePayload,
} from '../types/maintenance';

export const maintenanceApi = {
  list: async (params?: MaintenanceFilters): Promise<MaintenanceListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.building) searchParams.set('building', String(params.building));
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.renter) searchParams.set('renter', String(params.renter));
    if (params?.caretaker) searchParams.set('caretaker', String(params.caretaker));
    if (params?.vendor) searchParams.set('vendor', String(params.vendor));
    if (params?.date_from) searchParams.set('date_from', params.date_from);
    if (params?.date_to) searchParams.set('date_to', params.date_to);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<MaintenanceListResponse>(
      `${MAINTENANCE_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<MaintenanceDetailResponse> => {
    return apiService.get<MaintenanceDetailResponse>(MAINTENANCE_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: MaintenanceCreatePayload): Promise<MaintenanceDetailResponse> => {
    return apiService.post<MaintenanceDetailResponse>(MAINTENANCE_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: MaintenanceUpdatePayload): Promise<MaintenanceDetailResponse> => {
    return apiService.patch<MaintenanceDetailResponse>(MAINTENANCE_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(MAINTENANCE_CONSTANTS.API.DELETE(id));
  },

  getDashboard: async (): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.DASHBOARD);
  },

  updateStatus: async (id: number | string, data: { status: string; resolution_notes?: string }): Promise<any> => {
    return apiService.post(MAINTENANCE_CONSTANTS.API.UPDATE_STATUS(id), data);
  },

  assignCaretaker: async (id: number | string, caretakerId: number): Promise<any> => {
    return apiService.post(MAINTENANCE_CONSTANTS.API.ASSIGN_CARETAKER(id), { caretaker_id: caretakerId });
  },

  assignVendor: async (id: number | string, vendorId: number): Promise<any> => {
    return apiService.post(MAINTENANCE_CONSTANTS.API.ASSIGN_VENDOR(id), { vendor_id: vendorId });
  },

  addComment: async (id: number | string, data: MaintenanceCommentPayload): Promise<any> => {
    return apiService.post(MAINTENANCE_CONSTANTS.API.COMMENTS(id), data);
  },

  listComments: async (id: number | string): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.COMMENTS(id));
  },

  addExpense: async (id: number | string, data: MaintenanceExpensePayload): Promise<any> => {
    return apiService.post(MAINTENANCE_CONSTANTS.API.EXPENSES(id), data);
  },

  listExpenses: async (id: number | string): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.EXPENSES(id));
  },

  uploadPhoto: async (id: number | string, formData: FormData): Promise<any> => {
    return apiService.post(MAINTENANCE_CONSTANTS.API.PHOTOS(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  listPhotos: async (id: number | string): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.PHOTOS(id));
  },

  uploadDocument: async (id: number | string, formData: FormData): Promise<any> => {
    return apiService.post(MAINTENANCE_CONSTANTS.API.DOCUMENTS(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  listDocuments: async (id: number | string): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.DOCUMENTS(id));
  },

  getTimeline: async (id: number | string): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.TIMELINE(id));
  },

  getResolved: async (params?: MaintenanceFilters): Promise<MaintenanceListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    const query = searchParams.toString();
    return apiService.get<MaintenanceListResponse>(
      `${MAINTENANCE_CONSTANTS.API.RESOLVED}${query ? `?${query}` : ''}`
    );
  },

  getClosed: async (params?: MaintenanceFilters): Promise<MaintenanceListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    const query = searchParams.toString();
    return apiService.get<MaintenanceListResponse>(
      `${MAINTENANCE_CONSTANTS.API.CLOSED}${query ? `?${query}` : ''}`
    );
  },

  getVendors: async (): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.VENDORS);
  },

  getVendor: async (id: number | string): Promise<any> => {
    return apiService.get(MAINTENANCE_CONSTANTS.API.VENDOR_DETAIL(id));
  },
};
