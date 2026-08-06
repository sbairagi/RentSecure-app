import type { SortOption, UnitStatusConfig, UnitType, VacancyStatus } from '../types/units';

export const UNIT_CONSTANTS = {
  API: {
    LIST: '/api/units/',
    DETAIL: (id: number | string) => `/api/units/${id}/`,
    CREATE: '/api/units/',
    UPDATE: (id: number | string) => `/api/units/${id}/`,
    DELETE: (id: number | string) => `/api/units/${id}/`,
    OCCUPANCY_STATS: '/api/units/occupancy_stats',
    IMAGES: {
      LIST: '/api/unit-images/',
      UPLOAD: '/api/unit-images/',
      DELETE: (id: number | string) => `/api/unit-images/${id}/`,
    },
    DOCUMENTS: {
      LIST: '/api/unit-all-documents/',
      UPLOAD: '/api/unit-all-documents/',
      DELETE: (id: number | string) => `/api/unit-all-documents/${id}/`,
    },
    AGREEMENTS: {
      LIST: '/api/rent-agreements/',
      CREATE: '/api/rent-agreements/',
    },
    CARETAKERS: {
      LIST: '/api/caretakers/',
    },
    BULK: {
      UPDATE: '/api/units/bulk/',
      IMPORT: '/api/units/import/',
      EXPORT: '/api/units/export/',
    },
    QR_CODE: (id: number | string) => `/api/units/${id}/qr/`,
    ANALYTICS: '/api/units/analytics/',
    TIMELINE: (id: number | string) => `/api/units/${id}/timeline/`,
  },
  UNIT_TYPES: {
    LAND: 'land',
    FLAT: 'flat',
    COMMERCIAL_SHOP: 'commercial_shop',
    HOUSE: 'house',
    VILLA: 'villa',
    OFFICE: 'office',
    PAYING_GUEST: 'paying_guest',
  } as const satisfies Record<string, UnitType>,

  UNIT_TYPE_LABELS: {
    land: 'Land',
    flat: 'Flat/Apartment',
    commercial_shop: 'Commercial Shop',
    house: 'House',
    villa: 'Villa',
    office: 'Office',
    paying_guest: 'Paying Guest / PG',
  } as const satisfies Record<UnitType, string>,

  VACANCY_STATUS: {
    VACANT: 'vacant',
    OCCUPIED: 'occupied',
  } as const satisfies Record<string, VacancyStatus>,

  VACANCY_STATUS_LABELS: {
    vacant: 'Vacant',
    occupied: 'Occupied',
  } as const satisfies Record<VacancyStatus, string>,

  STATUS_CONFIG: {
    vacant: {
      label: 'Vacant',
      color: '#16a34a',
      backgroundColor: '#dcfce7',
    },
    occupied: {
      label: 'Occupied',
      color: '#2563eb',
      backgroundColor: '#dbeafe',
    },
  } as const satisfies Record<VacancyStatus, UnitStatusConfig>,

  SORT_OPTIONS: {
    newest: 'newest',
    oldest: 'oldest',
    rent_amount: 'rent_amount',
    occupancy: 'occupancy',
    alphabetical: 'alphabetical',
  } as const satisfies Record<string, SortOption>,

  SORT_LABELS: {
    newest: 'Newest',
    oldest: 'Oldest',
    rent_amount: 'Rent Amount',
    occupancy: 'Occupancy',
    alphabetical: 'Alphabetical',
  } as const satisfies Record<SortOption, string>,

  FILTERS: {
    BUILDING: 'building',
    PROPERTY: 'property',
    FLOOR: 'floor',
    STATUS: 'status',
    UNIT_TYPE: 'unit_type',
    RENT_RANGE: 'rent_range',
    AVAILABILITY: 'availability',
  } as const,

  BULK_ACTIONS: {
    ARCHIVE: 'archive',
    UNARCHIVE: 'unarchive',
    DELETE: 'delete',
    UPDATE_STATUS: 'update_status',
    UPDATE_BUILDING: 'update_building',
    EXPORT: 'export',
    IMPORT: 'import',
  } as const,

  EXPORT_FORMATS: {
    CSV: 'csv',
    EXCEL: 'xlsx',
  } as const,

  IMPORT_FORMATS: {
    CSV: 'csv',
    EXCEL: 'xlsx',
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
    NOT_FOUND: 'Unit not found.',
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
    TITLE: 'No units found',
    DESCRIPTION: 'Get started by adding your first unit.',
    ACTION_LABEL: 'Add Unit',
  } as const,
} as const;

export type UnitConstants = typeof UNIT_CONSTANTS;
