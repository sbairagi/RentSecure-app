import type { Building } from '../types/buildings';

export const computeBuildingStats = (building: Building) => {
  const units = building.units || [];
  const totalUnits = units.length;
  const occupiedUnits = units.filter(
    (u) => u.status === 'occupied' || u.is_vacant === false
  ).length;
  const vacantUnits = totalUnits - occupiedUnits;
  const monthlyRevenue = 0;
  return { totalUnits, occupiedUnits, vacantUnits, monthlyRevenue };
};

export const getBuildingStatus = (building: Building): 'active' | 'archived' => {
  return building.is_archived ? 'archived' : 'active';
};

export const formatBuildingAddress = (building: Building): string => {
  return [building.address_line, building.city, building.state, building.country]
    .filter(Boolean)
    .join(', ');
};
