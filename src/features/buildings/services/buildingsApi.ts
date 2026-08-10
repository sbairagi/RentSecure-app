import { apiService } from '@/services/api/apiClient';
import { BUILDING_CONSTANTS } from '../constants/buildingConstants';
import type { Building, BuildingAnalytics } from '../types/buildings';

export const buildingsApi = {
  list: async (): Promise<Building[]> => {
    return apiService.get<Building[]>(BUILDING_CONSTANTS.API.LIST);
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
