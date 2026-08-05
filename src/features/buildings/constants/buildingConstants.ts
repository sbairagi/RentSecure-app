export const BUILDING_CONSTANTS = {
  API: {
    LIST: '/api/buildings/',
    DETAIL: (id: number | string) => `/api/buildings/${id}/`,
    CREATE: '/api/buildings/',
    UPDATE: (id: number | string) => `/api/buildings/${id}/`,
    DELETE: (id: number | string) => `/api/buildings/${id}/`,
    ANALYTICS: (id: number | string) => `/api/buildings/${id}/analytics/`,
  },
  CACHE: {
    KEY: 'buildings_cache',
    TTL: 5 * 60 * 1000,
  },
  STATUS: {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
  },
} as const;
