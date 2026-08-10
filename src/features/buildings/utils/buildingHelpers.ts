import type { Building } from '../types/buildings';

export const computeBuildingStats = (building: Building) => {
  const totalUnits = building.units_count ?? building.units?.length ?? 0;
  const occupiedUnits = building.occupied_units_count ??
    (building.units || []).filter(
      (u) => u.status === 'occupied' || u.is_vacant === false
    ).length;
  const vacantUnits = totalUnits - occupiedUnits;
  return { totalUnits, occupiedUnits, vacantUnits };
};

export const getBuildingStatus = (building: Building): 'active' | 'archived' => {
  return building.is_archived ? 'archived' : 'active';
};

export const formatBuildingAddress = (building: Building): string => {
  return [building.address_line, building.city, building.state, building.country]
    .filter(Boolean)
    .join(', ');
};
