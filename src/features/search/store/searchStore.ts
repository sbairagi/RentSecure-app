import { create } from 'zustand';
import { SEARCH_CONSTANTS } from '../constants/searchConstants';
import type { SearchFilters, SearchResourceType } from '../types/search.types';
import { mmkvStorage } from '@/services/storage/mmkv';

const SENSITIVE_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /credit[_-]?card/i,
  /ssn/i,
  /\b\d{16}\b/,
];

function isSensitiveQuery(query: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(query));
}

function sanitizeQuery(query: string): string {
  const trimmed = query.trim().slice(0, 100);
  return isSensitiveQuery(trimmed) ? '' : trimmed.toLowerCase();
}

interface SearchStoreState {
  query: string;
  filters: SearchFilters;
  recentSearches: { query: string; timestamp: number }[];
}

interface SearchStoreActions {
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setResourceTypes: (types: SearchResourceType[]) => void;
  setOrdering: (ordering: 'newest' | 'oldest' | 'relevance') => void;
  setPage: (page: number) => void;
  addRecentSearch: (query: string) => Promise<void>;
  removeRecentSearch: (query: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
  loadRecentSearches: () => Promise<void>;
}

type SearchStore = SearchStoreState & SearchStoreActions;

const defaultFilters: SearchFilters = {
  resource_type: [],
  ordering: 'relevance',
  page: 1,
  page_size: SEARCH_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE,
};

const initialState: SearchStoreState = {
  query: '',
  filters: defaultFilters,
  recentSearches: [],
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setResourceTypes: (types) =>
    set((state) => ({
      filters: { ...state.filters, resource_type: types, page: 1 },
    })),

  setOrdering: (ordering) =>
    set((state) => ({
      filters: { ...state.filters, ordering, page: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  addRecentSearch: async (query) => {
    const sanitized = sanitizeQuery(query);
    if (!sanitized) return;

    const state = get();
    const filtered = state.recentSearches.filter((s) => s.query !== sanitized);
    const updated = [{ query: sanitized, timestamp: Date.now() }, ...filtered].slice(
      0,
      SEARCH_CONSTANTS.HISTORY.MAX_ITEMS
    );

    try {
      await mmkvStorage.setItem(SEARCH_CONSTANTS.HISTORY.STORAGE_KEY, JSON.stringify(updated));
      set({ recentSearches: updated });
    } catch {
      console.error('Failed to save search history');
    }
  },

  removeRecentSearch: async (query) => {
    const sanitized = sanitizeQuery(query);
    const updated = get().recentSearches.filter((s) => s.query !== sanitized);
    try {
      await mmkvStorage.setItem(SEARCH_CONSTANTS.HISTORY.STORAGE_KEY, JSON.stringify(updated));
      set({ recentSearches: updated });
    } catch {
      console.error('Failed to update search history');
    }
  },

  clearRecentSearches: async () => {
    try {
      await mmkvStorage.removeItem(SEARCH_CONSTANTS.HISTORY.STORAGE_KEY);
      set({ recentSearches: [] });
    } catch {
      console.error('Failed to clear search history');
    }
  },

  loadRecentSearches: async () => {
    try {
      const raw = await mmkvStorage.getItem(SEARCH_CONSTANTS.HISTORY.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { query: string; timestamp: number }[];
        const valid = parsed.filter((s) => s.query && typeof s.timestamp === 'number');
        set({ recentSearches: valid.slice(0, SEARCH_CONSTANTS.HISTORY.MAX_ITEMS) });
      }
    } catch {
      set({ recentSearches: [] });
    }
  },
}));
