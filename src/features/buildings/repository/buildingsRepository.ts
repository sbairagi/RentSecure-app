import { buildingsApi } from '../services/buildingsApi';
import type { Building, BuildingAnalytics } from '../types/buildings';

export const buildingsRepository = {
  fetchBuildings: async (): Promise<Building[]> => {
    return buildingsApi.list();
  },

  fetchBuilding: async (id: number | string): Promise<Building> => {
    return buildingsApi.retrieve(id);
  },

  createBuilding: async (data: Partial<Building>): Promise<Building> => {
    return buildingsApi.create(data);
  },

  updateBuilding: async (id: number | string, data: Partial<Building>): Promise<Building> => {
    return buildingsApi.update(id, data);
  },

  deleteBuilding: async (id: number | string): Promise<void> => {
    return buildingsApi.remove(id);
  },

  fetchAnalytics: async (id: number | string): Promise<BuildingAnalytics> => {
    try {
      return buildingsApi.getAnalytics(id);
    } catch {
      return buildingsApi.retrieve(id).then((b) => ({
        building_id: b.id,
        building_name: b.name,
        total_units: b.units_count ?? b.units?.length ?? 0,
        occupied_units: b.occupied_units_count ??
          (b.units || []).filter(
            (u: any) => u.status === 'occupied' || u.is_vacant === false
          ).length,
        vacant_units: (b.units_count ?? b.units?.length ?? 0) -
          (b.occupied_units_count ??
            (b.units || []).filter(
              (u: any) => u.status === 'occupied' || u.is_vacant === false
            ).length),
        occupancy_rate: 0,
      }));
    }
  },
};
