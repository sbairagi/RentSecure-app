import type {
  AgreementStatus,
  AgreementStatusConfig,
  SortOption,
} from '../types/agreements';

export const AGREEMENT_CONSTANTS = {
  API: {
    LIST: '/api/rent-agreements/',
    DETAIL: (id: number | string) => `/api/rent-agreements/${id}/`,
    CREATE: '/api/rent-agreements/',
    UPDATE: (id: number | string) => `/api/rent-agreements/${id}/`,
    DELETE: (id: number | string) => `/api/rent-agreements/${id}/`,
    SEND_FOR_SIGNATURE: (id: number | string) => `/api/rent-agreements/${id}/send-for-signature/`,
    GENERATE_PDF: (id: number | string) =>
      `/api/document/rent_agreement/${id}/generate-rent-agreement-pdf/`,
    STATUS_SUMMARY: '/api/rent-agreements/status_summary/',
    RECENT_ACTIVITY: '/api/rent-agreements/recent_activity/',
    TIMELINE: (id: number | string) => `/api/rent-agreements/${id}/timeline/`,
    DOCUMENTS: {
      LIST: (agreementId: number | string) => `/api/rent-agreements/${agreementId}/documents/`,
      UPLOAD: (agreementId: number | string) => `/api/rent-agreements/${agreementId}/upload-document/`,
    },
    WITNESSES: {
      LIST: (agreementId: number | string) => `/api/rent-agreements/${agreementId}/witnesses/`,
    },
    TEMPLATES: '/api/agreement-templates/',
    BOOTSTRAP: '/api/auth/bootstrap/',
    USAGE_LIMITS: '/api/usage-limits/',
    RENTERS: '/api/renters/',
    BUILDINGS: '/api/buildings/',
    UNITS: '/api/units/',
    NOTIFICATIONS: {
      LIST: '/api/notifications/get/',
      MARK_READ: (id: number | string) => `/api/notifications/mark/${id}/`,
    },
    DOCUMENTS_PDF: {
      RENT_AGREEMENT_PDF: (id: number | string) =>
        `/api/document/rent_agreement/${id}/generate-rent-agreement-pdf/`,
    },
  },
  STATUS: {
    DRAFT: 'draft',
    PENDING_SIGNATURE: 'pending_signature',
    PARTIALLY_SIGNED: 'partially_signed',
    FULLY_SIGNED: 'fully_signed',
    ACTIVE: 'active',
    EXPIRED: 'expired',
    TERMINATED: 'terminated',
    CANCELLED: 'cancelled',
  } as const satisfies Record<string, AgreementStatus>,

  STATUS_LABELS: {
    draft: 'Draft',
    pending_signature: 'Pending Signature',
    partially_signed: 'Partially Signed',
    fully_signed: 'Fully Signed',
    active: 'Active',
    expired: 'Expired',
    terminated: 'Terminated',
    cancelled: 'Cancelled',
  } as const satisfies Record<AgreementStatus, string>,

  STATUS_CONFIG: {
    draft: {
      label: 'Draft',
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
    },
    pending_signature: {
      label: 'Pending Signature',
      color: '#d97706',
      backgroundColor: '#fef3c7',
    },
    partially_signed: {
      label: 'Partially Signed',
      color: '#2563eb',
      backgroundColor: '#dbeafe',
    },
    fully_signed: {
      label: 'Fully Signed',
      color: '#059669',
      backgroundColor: '#d1fae5',
    },
    active: {
      label: 'Active',
      color: '#16a34a',
      backgroundColor: '#dcfce7',
    },
    expired: {
      label: 'Expired',
      color: '#dc2626',
      backgroundColor: '#fee2e2',
    },
    terminated: {
      label: 'Terminated',
      color: '#991b1b',
      backgroundColor: '#fef2f2',
    },
    cancelled: {
      label: 'Cancelled',
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
    },
  } as const satisfies Record<AgreementStatus, AgreementStatusConfig>,

  SORT_OPTIONS: {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    START_DATE: 'start_date',
    END_DATE: 'end_date',
    STATUS: 'status',
    RENTER: 'renter',
  } as const satisfies Record<string, SortOption>,

  SORT_LABELS: {
    newest: 'Newest',
    oldest: 'Oldest',
    start_date: 'Start Date',
    end_date: 'End Date',
    status: 'Status',
    renter: 'Renter Name',
  } as const satisfies Record<SortOption, string>,

  FILTERS: {
    SEARCH: 'search',
    STATUS: 'status',
    BUILDING: 'building',
    UNIT: 'unit',
    RENTER: 'renter',
    DATE_FROM: 'date_from',
    DATE_TO: 'date_to',
    IS_SIGNED: 'is_signed',
  } as const,

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  } as const,

  CACHE: {
    STALE_TIME: 5 * 60 * 1000,
    GC_TIME: 10 * 60 * 1000,
  } as const,

  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'Agreement not found.',
    CONFLICT: 'This action conflicts with existing data.',
    VALIDATION_ERROR: 'Please check the entered data.',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    SERVER_ERROR: 'Server error. Please try again later.',
    MAINTENANCE: 'The system is under maintenance. Please try again later.',
    SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew to continue.',
    PERMISSION_DENIED: 'You do not have permission to access this resource.',
    OFFLINE: 'You are offline. Some features may be unavailable.',
    LIMIT_REACHED: 'You have reached your agreement limit. Please upgrade.',
    GENERIC: 'Something went wrong. Please try again.',
  } as const,

  EMPTY_STATE: {
    TITLE: 'No agreements found',
    DESCRIPTION: 'Create your first rent agreement to get started.',
    ACTION_LABEL: 'Create Agreement',
  } as const,

  STORAGE: {
    AGREEMENTS_CACHE: 'agreements_cache',
    SELECTED_AGREEMENT: 'selected_agreement',
    FILTERS: 'agreements_filters',
  } as const,
} as const;

export type AgreementConstants = typeof AGREEMENT_CONSTANTS;
