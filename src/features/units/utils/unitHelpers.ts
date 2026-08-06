import { UNIT_CONSTANTS } from '../constants/unitConstants';
import type { Unit, UnitFilters, UnitType, VacancyStatus } from '../types/units';

export const formatUnitType = (type: UnitType): string => {
  return UNIT_CONSTANTS.UNIT_TYPE_LABELS[type] || type;
};

export const formatStatus = (status: VacancyStatus): string => {
  return UNIT_CONSTANTS.VACANCY_STATUS_LABELS[status] || status;
};

export const getStatusColor = (status: VacancyStatus): string => {
  return UNIT_CONSTANTS.STATUS_CONFIG[status]?.color || '#374151';
};

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isUnitVacant = (unit: Unit): boolean => {
  return unit.is_vacant || unit.status === 'vacant';
};

export const filterUnits = (units: Unit[], filters: UnitFilters): Unit[] => {
  return units.filter((unit) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matches =
        unit.unit.toLowerCase().includes(search) ||
        unit.building_name.toLowerCase().includes(search) ||
        unit.city.toLowerCase().includes(search) ||
        unit.unit_type.toLowerCase().includes(search);
      if (!matches) return false;
    }
    if (filters.building && unit.building !== filters.building) {
      return false;
    }
    if (filters.status && unit.status !== filters.status) {
      return false;
    }
    if (filters.unit_type && unit.unit_type !== filters.unit_type) {
      return false;
    }
    if (filters.is_archived !== undefined && unit.is_archived !== filters.is_archived) {
      return false;
    }
    return true;
  });
};

export const sortUnits = (units: Unit[], sortBy: string): Unit[] => {
  const sorted = [...units];
  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case 'alphabetical':
      return sorted.sort((a, b) => a.unit.localeCompare(b.unit));
    case 'occupancy':
      return sorted.sort((a, b) => Number(b.is_vacant) - Number(a.is_vacant));
    default:
      return sorted;
  }
};

export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const link = document.createElement('a');
      link.href = reader.result as string;
      link.download = filename;
      link.click();
    };
  } catch {
    // Error handled by caller
  }
};

export const generateCSV = (units: Unit[]): string => {
  const headers = ['Unit', 'Type', 'Status', 'Building', 'City', 'State', 'Country', 'Postal Code'];
  const rows = units.map((unit) => [
    unit.unit,
    formatUnitType(unit.unit_type),
    formatStatus(unit.status),
    unit.building_name,
    unit.city,
    unit.state,
    unit.country,
    unit.postal_code,
  ]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};
