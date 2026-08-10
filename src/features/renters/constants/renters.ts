import type {
  KycDocumentType,
  PaymentMethod,
  PaymentStatus,
  Renter,
  RenterStatus,
  RenterStatusConfig,
  SortOption,
} from '../types/renters';

export const RENTER_CONSTANTS = {
  API: {
    LIST: '/api/renters/',
    DETAIL: (id: number | string) => `/api/renters/${id}/`,
    CREATE: '/api/renters/',
    UPDATE: (id: number | string) => `/api/renters/${id}/`,
    DELETE: (id: number | string) => `/api/renters/${id}/`,
    RATE: (id: number | string) => `/api/renters/${id}/rate/`,
    UPDATE_STATUS: (id: number | string) => `/api/renters/${id}/update-status/`,
    VACATE: (id: number | string) => `/api/renters/${id}/vacate/`,
    STATUS_SUMMARY: '/api/renters/status_summary/',
    RECENT_ACTIVITY: '/api/renters/recent_activity/',
    TIMELINE: (id: number | string) => `/api/renters/${id}/timeline/`,
    ASSIGN_UNIT: (id: number | string) => `/api/renters/${id}/assign-unit/`,
    TRANSFER_UNIT: (id: number | string) => `/api/renters/${id}/transfer-unit/`,
    KYC_DOCUMENTS: {
      LIST: (renterId: number | string) => `/api/renters/${renterId}/kyc-documents/`,
      DETAIL: (id: number | string) => `/api/kyc-documents/${id}/`,
      OCR: (id: number | string) => `/api/kyc-documents/${id}/ocr/`,
    },
    DOCUMENTS: {
      LIST: (renterId: number | string) => `/api/renters/${renterId}/documents/`,
    },
    NOTES: {
      LIST: (renterId: number | string) => `/api/renters/${renterId}/notes/`,
      DETAIL: (id: number | string) => `/api/renter-notes/${id}/`,
    },
    BULK_NOTIFY: (renterId: number | string) => `/api/renters/${renterId}/bulk-notify/`,
    EXPORT: '/api/renters/export/',
    IMPORT: '/api/renters/bulk-import/',
    RENT_RECORDS: {
      LIST: '/api/rent-records/',
      DETAIL: (id: number | string) => `/api/rent-records/${id}/`,
    },
    EXTRA_CHARGES: '/api/extra-charges/',
    POLICE_VERIFICATIONS: {
      LIST: '/api/police-verifications/',
      DETAIL: (id: number | string) => `/api/police-verifications/${id}/`,
    },
    AGREEMENTS: {
      LIST: '/api/rent-agreements/',
      DETAIL: (id: number | string) => `/api/rent-agreements/${id}/`,
    },
    NOTIFICATIONS: {
      LIST: '/api/notifications/get/',
      MARK_READ: (id: number | string) => `/api/notifications/mark/${id}/`,
    },
    BOOTSTRAP: '/api/auth/bootstrap/',
    USAGE_LIMITS: '/api/usage-limits/',
    UNITS: '/api/units/',
    BUILDINGS: '/api/buildings/',
    DOCUMENTS_PDF: {
      RENT_AGREEMENT_PDF: (id: number | string) =>
        `/documents/document/rent_agreement/${id}/generate-rent-agreement-pdf/`,
      PROPERTIES_DOSSIER_PDF: (id: number | string) =>
        `/documents/document/properties/${id}/generate-dossier-pdf/`,
    },
  },
  STATUS: {
    ACTIVE: 'active',
    NOTICE_PERIOD: 'notice_period',
    REVOKED: 'revoked',
    DEACTIVATED: 'deactivated',
  } as const satisfies Record<string, RenterStatus>,

  STATUS_LABELS: {
    active: 'Active',
    notice_period: 'Notice Period',
    revoked: 'Revoked',
    deactivated: 'Deactivated',
  } as const satisfies Record<RenterStatus, string>,

  STATUS_CONFIG: {
    active: {
      label: 'Active',
      color: '#16a34a',
      backgroundColor: '#dcfce7',
    },
    notice_period: {
      label: 'Notice Period',
      color: '#d97706',
      backgroundColor: '#fef3c7',
    },
    revoked: {
      label: 'Revoked',
      color: '#dc2626',
      backgroundColor: '#fee2e2',
    },
    deactivated: {
      label: 'Deactivated',
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
    },
  } as const satisfies Record<RenterStatus, RenterStatusConfig>,

  SORT_OPTIONS: {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    NAME: 'name',
    RENT_AMOUNT: 'rent_amount',
    STATUS: 'status',
  } as const satisfies Record<string, SortOption>,

  SORT_LABELS: {
    newest: 'Newest',
    oldest: 'Oldest',
    name: 'Name',
    rent_amount: 'Rent Amount',
    status: 'Status',
  } as const satisfies Record<SortOption, string>,

  FILTERS: {
    SEARCH: 'search',
    STATUS: 'status',
    BUILDING: 'building',
    UNIT: 'unit',
  } as const,

  PAYMENT_METHODS: {
    CASH: 'cash',
    BANK_TRANSFER: 'bank_transfer',
    UPI: 'upi',
    CHEQUE: 'cheque',
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    OTHER: 'other',
  } as const satisfies Record<string, PaymentMethod>,

  PAYMENT_METHOD_LABELS: {
    cash: 'Cash',
    bank_transfer: 'Bank Transfer',
    upi: 'UPI',
    cheque: 'Cheque',
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    other: 'Other',
  } as const satisfies Record<PaymentMethod, string>,

  PAYMENT_STATUSES: {
    PENDING: 'pending',
    PAID: 'paid',
    OVERDUE: 'overdue',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  } as const satisfies Record<string, PaymentStatus>,

  PAYMENT_STATUS_LABELS: {
    pending: 'Pending',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  } as const satisfies Record<PaymentStatus, string>,

  KYC_DOCUMENT_TYPES: {
    AADHAAR: 'aadhaar',
    PAN: 'pan',
    PASSPORT: 'passport',
    DRIVING_LICENSE: 'driving_license',
    VOTER_ID: 'voter_id',
    OTHER: 'other',
  } as const satisfies Record<string, KycDocumentType>,

  KYC_DOCUMENT_TYPE_LABELS: {
    aadhaar: 'Aadhaar',
    pan: 'PAN',
    passport: 'Passport',
    driving_license: 'Driving License',
    voter_id: 'Voter ID',
    other: 'Other',
  } as const satisfies Record<KycDocumentType, string>,

  BULK_ACTIONS: {
    NOTIFY: 'notify',
    EXPORT: 'export',
    IMPORT: 'import',
    UPDATE_STATUS: 'update_status',
    ARCHIVE: 'archive',
    UNARCHIVE: 'unarchive',
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
    NOT_FOUND: 'Renter not found.',
    CONFLICT: 'This action conflicts with existing data.',
    VALIDATION_ERROR: 'Please check the entered data.',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    SERVER_ERROR: 'Server error. Please try again later.',
    MAINTENANCE: 'The system is under maintenance. Please try again later.',
    SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew to continue.',
    PERMISSION_DENIED: 'You do not have permission to access this resource.',
    OFFLINE: 'You are offline. Some features may be unavailable.',
    LIMIT_REACHED: 'You have reached your plan limit. Please upgrade.',
    GENERIC: 'Something went wrong. Please try again.',
  } as const,

  EMPTY_STATE: {
    TITLE: 'No renters found',
    DESCRIPTION: 'Get started by adding your first renter.',
    ACTION_LABEL: 'Add Renter',
  } as const,
} as const;

export type RenterConstants = typeof RENTER_CONSTANTS;
