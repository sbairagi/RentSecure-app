import { AGREEMENT_CONSTANTS } from '../constants/agreements';
import type {
  Agreement,
  AgreementFilters,
  AgreementStatus,
  AgreementStatusSummary,
  AgreementWithRelations,
  SortOption,
} from '../types/agreements';

export const formatAgreementStatus = (status: AgreementStatus): string => {
  return AGREEMENT_CONSTANTS.STATUS_LABELS[status] || status;
};

export const getAgreementStatusColor = (status: AgreementStatus): string => {
  return AGREEMENT_CONSTANTS.STATUS_CONFIG[status]?.color || '#374151';
};

export const getAgreementStatusBackgroundColor = (status: AgreementStatus): string => {
  return AGREEMENT_CONSTANTS.STATUS_CONFIG[status]?.backgroundColor || '#f3f4f6';
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

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const deriveAgreementStatus = (agreement: Agreement): AgreementStatus => {
  if (agreement.is_agreement_revoked) return 'terminated';
  if (agreement.owner_signed && agreement.renter_signed) {
    if (new Date(agreement.agreement_end_date) < new Date()) return 'expired';
    return 'active';
  }
  if (agreement.owner_signed || agreement.renter_signed) return 'partially_signed';
  if (agreement.leegality_document_id) return 'pending_signature';
  return 'draft';
};

export const isAgreementActive = (agreement: Agreement): boolean => {
  return deriveAgreementStatus(agreement) === 'active';
};

export const isAgreementExpired = (agreement: Agreement): boolean => {
  return deriveAgreementStatus(agreement) === 'expired';
};

export const isAgreementFullySigned = (agreement: Agreement): boolean => {
  return agreement.owner_signed && agreement.renter_signed;
};

export const isAgreementPartiallySigned = (agreement: Agreement): boolean => {
  return (agreement.owner_signed || agreement.renter_signed) && !isAgreementFullySigned(agreement);
};

export const filterAgreements = (agreements: Agreement[], filters: AgreementFilters): Agreement[] => {
  return agreements.filter((agreement) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matches =
        (agreement.renter_name && agreement.renter_name.toLowerCase().includes(search)) ||
        (agreement.unit_name && agreement.unit_name.toLowerCase().includes(search)) ||
        (agreement.building_name && agreement.building_name.toLowerCase().includes(search)) ||
        String(agreement.id).includes(search);
      if (!matches) return false;
    }
    if (filters.status && deriveAgreementStatus(agreement) !== filters.status) {
      return false;
    }
    if (filters.building && agreement.building_name !== String(filters.building)) {
      return false;
    }
    if (filters.unit && agreement.unit_name !== String(filters.unit)) {
      return false;
    }
    if (filters.renter && agreement.renter !== filters.renter) {
      return false;
    }
    if (filters.is_signed !== undefined && !isAgreementFullySigned(agreement) !== filters.is_signed) {
      return false;
    }
    if (filters.date_from && agreement.agreement_start_date < filters.date_from) {
      return false;
    }
    if (filters.date_to && agreement.agreement_end_date > filters.date_to) {
      return false;
    }
    return true;
  });
};

export const sortAgreements = (agreements: Agreement[], sortBy: SortOption): Agreement[] => {
  const sorted = [...agreements];
  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case 'start_date':
      return sorted.sort(
        (a, b) => new Date(b.agreement_start_date).getTime() - new Date(a.agreement_start_date).getTime()
      );
    case 'end_date':
      return sorted.sort(
        (a, b) => new Date(b.agreement_end_date).getTime() - new Date(a.agreement_end_date).getTime()
      );
    case 'status':
      return sorted.sort((a, b) => deriveAgreementStatus(a).localeCompare(deriveAgreementStatus(b)));
    case 'renter':
      return sorted.sort((a, b) =>
        (a.renter_name || '').localeCompare(b.renter_name || '')
      );
    default:
      return sorted;
  }
};

export const generateCSV = (agreements: Agreement[]): string => {
  const headers = [
    'ID',
    'Renter',
    'Unit',
    'Building',
    'Start Date',
    'End Date',
    'Rent Amount',
    'Status',
    'Owner Signed',
    'Renter Signed',
  ];
  const rows = agreements.map((agreement) => [
    String(agreement.id),
    agreement.renter_name || String(agreement.renter),
    agreement.unit_name || String(agreement.unit),
    agreement.building_name || '',
    agreement.agreement_start_date,
    agreement.agreement_end_date,
    agreement.rent_amount,
    deriveAgreementStatus(agreement),
    agreement.owner_signed ? 'Yes' : 'No',
    agreement.renter_signed ? 'Yes' : 'No',
  ]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};

export const parseAgreementStatusSummary = (
  summary: AgreementStatusSummary
): { label: string; value: number; color: string; backgroundColor: string }[] => {
  const entries: {
    key: AgreementStatus;
    label: string;
    color: string;
    backgroundColor: string;
  }[] = [
    { key: 'draft', label: 'Draft', color: '#6b7280', backgroundColor: '#f3f4f6' },
    { key: 'pending_signature', label: 'Pending Signature', color: '#d97706', backgroundColor: '#fef3c7' },
    { key: 'partially_signed', label: 'Partially Signed', color: '#2563eb', backgroundColor: '#dbeafe' },
    { key: 'fully_signed', label: 'Fully Signed', color: '#059669', backgroundColor: '#d1fae5' },
    { key: 'active', label: 'Active', color: '#16a34a', backgroundColor: '#dcfce7' },
    { key: 'expired', label: 'Expired', color: '#dc2626', backgroundColor: '#fee2e2' },
    { key: 'terminated', label: 'Terminated', color: '#991b1b', backgroundColor: '#fef2f2' },
    { key: 'cancelled', label: 'Cancelled', color: '#6b7280', backgroundColor: '#f3f4f6' },
  ];

  return entries.map((entry) => ({
    label: entry.label,
    value: summary[entry.key] || 0,
    color: entry.color,
    backgroundColor: entry.backgroundColor,
  }));
};

export const getAgreementFullAddress = (agreement: AgreementWithRelations): string => {
  const parts = [
    agreement.unit_details?.unit,
    agreement.unit_details?.building_name,
  ].filter(Boolean);
  return parts.join(' - ') || 'N/A';
};

export const getAgreementDuration = (agreement: Agreement): string => {
  const start = new Date(agreement.agreement_start_date);
  const end = new Date(agreement.agreement_end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}${days > 0 ? ` ${days} day${days > 1 ? 's' : ''}` : ''}`;
  }
  return `${days} day${days > 1 ? 's' : ''}`;
};
