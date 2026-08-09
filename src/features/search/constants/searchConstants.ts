export const SEARCH_CONSTANTS = {
  API: {
    GLOBAL_SEARCH: '/api/search/',
    SUGGESTIONS: '/api/search/suggestions/',
  },
  DEBOUNCE: {
    SUGGESTIONS_MS: 300,
    SEARCH_MS: 400,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 50,
  },
  HISTORY: {
    MAX_ITEMS: 10,
    STORAGE_KEY: '@search_history',
  },
  RESOURCE_TYPES: {
    buildings: { label: 'Buildings', icon: '🏢', color: '#2563EB' },
    units: { label: 'Units', icon: '🚪', color: '#059669' },
    renters: { label: 'Renters', icon: '👥', color: '#D97706' },
    caretakers: { label: 'Caretakers', icon: '🛡️', color: '#0891B2' },
    rent_records: { label: 'Rent Records', icon: '📋', color: '#7C3AED' },
    visitors: { label: 'Visitors', icon: '👤', color: '#DC2626' },
    agreements: { label: 'Agreements', icon: '📄', color: '#059669' },
  } as const,
} as const;
