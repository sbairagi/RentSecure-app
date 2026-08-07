import { apiService } from '@/services/api/apiClient';
import { CARETAKER_CONSTANTS } from '../constants/caretakerConstants';
import type {
  Caretaker,
  CaretakerCreatePayload,
  CaretakerDetailResponse,
  CaretakerFilters,
  CaretakerListResponse,
  CaretakerUpdatePayload,
} from '../types/caretakers';

export const caretakersApi = {
  list: async (params?: CaretakerFilters): Promise<CaretakerListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<CaretakerListResponse>(
      `${CARETAKER_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<CaretakerDetailResponse> => {
    return apiService.get<CaretakerDetailResponse>(CARETAKER_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: CaretakerCreatePayload): Promise<Caretaker> => {
    return apiService.post<Caretaker>(CARETAKER_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: CaretakerUpdatePayload): Promise<Caretaker> => {
    return apiService.patch<Caretaker>(CARETAKER_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(CARETAKER_CONSTANTS.API.DELETE(id));
  },

  deactivate: async (id: number | string): Promise<Caretaker> => {
    return apiService.post<Caretaker>(CARETAKER_CONSTANTS.API.DEACTIVATE(id), {});
  },

  getLimits: async (): Promise<any> => {
    return apiService.get(CARETAKER_CONSTANTS.API.LIMITS);
  },

  getSubscription: async (): Promise<any> => {
    return apiService.get(CARETAKER_CONSTANTS.API.SUBSCRIPTION);
  },

  getNotifications: async (): Promise<any> => {
    return apiService.get(CARETAKER_CONSTANTS.API.NOTIFICATIONS);
  },

  getUnitDocuments: async (unitId: number): Promise<any> => {
    return apiService.get(`${CARETAKER_CONSTANTS.API.UNIT_DOCUMENTS}?unit=${unitId}`);
  },
};
