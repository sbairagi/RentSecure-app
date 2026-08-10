import { RENTER_CONSTANTS } from '../constants/renters';
import type {
  KycDocument,
  PaymentMethod,
  PaymentStatus,
  Renter,
  RenterFilters,
  RenterStatus,
  RenterStatusSummary,
} from '../types/renters';

export const formatRenterStatus = (status: RenterStatus): string => {
  return RENTER_CONSTANTS.STATUS_LABELS[status] || status;
};

export const getRenterStatusColor = (status: RenterStatus): string => {
  return RENTER_CONSTANTS.STATUS_CONFIG[status]?.color || '#374151';
};

export const getRenterStatusBackgroundColor = (status: RenterStatus): string => {
  return RENTER_CONSTANTS.STATUS_CONFIG[status]?.backgroundColor || '#f3f4f6';
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

export const formatPaymentMethod = (method: PaymentMethod): string => {
  return RENTER_CONSTANTS.PAYMENT_METHOD_LABELS[method] || method;
};

export const formatPaymentStatus = (status: PaymentStatus): string => {
  return RENTER_CONSTANTS.PAYMENT_STATUS_LABELS[status] || status;
};

export const formatKycDocumentType = (type: KycDocument): string => {
  return RENTER_CONSTANTS.KYC_DOCUMENT_TYPE_LABELS[type.document_type as keyof typeof RENTER_CONSTANTS.KYC_DOCUMENT_TYPE_LABELS] || type.document_type;
};

export const filterRenters = (renters: Renter[], filters: RenterFilters): Renter[] => {
  return renters.filter((renter) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matches =
        renter.name.toLowerCase().includes(search) ||
        renter.email?.toLowerCase().includes(search) ||
        renter.phone.includes(search) ||
        (renter.unit_name && renter.unit_name.toLowerCase().includes(search)) ||
        (renter.building_name && renter.building_name.toLowerCase().includes(search));
      if (!matches) return false;
    }
    if (filters.status && renter.status !== filters.status) {
      return false;
    }
    if (filters.building && renter.building_name !== String(filters.building)) {
      return false;
    }
    if (filters.unit && renter.unit_name !== String(filters.unit)) {
      return false;
    }
    return true;
  });
};

export const sortRenters = (renters: Renter[], sortBy: string): Renter[] => {
  const sorted = [...renters];
  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rent_amount':
      return sorted.sort((a, b) => parseFloat(b.rent_amount) - parseFloat(a.rent_amount));
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
    default:
      return sorted;
  }
};

export const isRenterActive = (renter: Renter): boolean => {
  return renter.status === 'active';
};

export const isRenterOnNotice = (renter: Renter): boolean => {
  return renter.status === 'notice_period';
};

export const isRenterArchived = (renter: Renter): boolean => {
  return renter.status === 'deactivated' || renter.status === 'revoked';
};

export const getRenterFullAddress = (renter: Renter): string => {
  const parts = [
    renter.address_line,
    renter.building_name,
    renter.city,
    renter.state,
    renter.country,
    renter.postal_code,
  ].filter(Boolean);
  return parts.join(', ') || 'N/A';
};

export const getRenterUnitInfo = (renter: Renter): string | null => {
  if (!renter.unit && !renter.building_name) return null;
  const parts = [renter.unit_name, renter.building_name].filter(Boolean);
  return parts.join(' - ') || null;
};

export const generateCSV = (renters: Renter[]): string => {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Status',
    'Rent Amount',
    'Start Date',
    'End Date',
    'Unit',
    'Building',
    'City',
    'State',
  ];
  const rows = renters.map((renter) => [
    renter.name,
    renter.email || '',
    renter.phone,
    renter.status,
    renter.rent_amount,
    renter.start_date,
    renter.end_date || '',
    renter.unit_name || '',
    renter.building_name || '',
    renter.city || '',
    renter.state || '',
  ]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};

export const parseRenterStatusSummary = (
  summary: RenterStatusSummary
): { label: string; value: number; color: string; backgroundColor: string }[] => {
  const entries: {
    key: RenterStatus;
    label: string;
    color: string;
    backgroundColor: string;
  }[] = [
    { key: 'active', label: 'Active', color: '#16a34a', backgroundColor: '#dcfce7' },
    { key: 'notice_period', label: 'Notice Period', color: '#d97706', backgroundColor: '#fef3c7' },
    { key: 'revoked', label: 'Revoked', color: '#dc2626', backgroundColor: '#fee2e2' },
    { key: 'deactivated', label: 'Deactivated', color: '#6b7280', backgroundColor: '#f3f4f6' },
  ];

  return entries.map((entry) => ({
    label: entry.label,
    value: summary[entry.key] || 0,
    color: entry.color,
    backgroundColor: entry.backgroundColor,
  }));
};

export const validatePhone = (phone: string): boolean => {
  return /^\+?1?\d{9,15}$/.test(phone);
};

export const formatRentAmount = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};
