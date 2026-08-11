import { apiService } from '@/services/api/apiClient';
import { BUILDING_CONSTANTS } from '../constants/buildingConstants';
import type { Building, BuildingAnalytics } from '../types/buildings';

export const buildingsApi = {
  list: async (params?: { search?: string; city?: string; state?: string; country?: string; is_archived?: boolean; ordering?: string }): Promise<Building[]> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.city) searchParams.set('city', params.city);
    if (params?.state) searchParams.set('state', params.state);
    if (params?.country) searchParams.set('country', params.country);
    if (params?.is_archived !== undefined) searchParams.set('is_archived', String(params.is_archived));
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    const query = searchParams.toString();
    return apiService.get<Building[]>(
      `${BUILDING_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Building> => {
    return apiService.get<Building>(BUILDING_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: Partial<Building>): Promise<Building> => {
    return apiService.post<Building>(BUILDING_CONSTANTS.API.CREATE, data);
  },

  update: async (id: number | string, data: Partial<Building>): Promise<Building> => {
    return apiService.patch<Building>(BUILDING_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(BUILDING_CONSTANTS.API.DELETE(id));
  },

  getAnalytics: async (id: number | string): Promise<BuildingAnalytics> => {
    return apiService.get<BuildingAnalytics>(BUILDING_CONSTANTS.API.ANALYTICS(id));
  },
};
