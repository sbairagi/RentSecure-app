import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type {
  RentFilters,
  RentListResponse,
  RentOverviewItem,
  RentRecord,
  RenterDueRent,
} from '../types/rents';

interface RentsState {
  rentRecords: RentRecord[];
  selectedRent: RentRecord | null;
  ownerOverview: RentOverviewItem[];
  renterDueRent: RenterDueRent | null;
  filters: RentFilters;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isOffline: boolean;
}

interface RentsActions {
  setRentRecords: (records: RentRecord[]) => void;
  setSelectedRent: (rent: RentRecord | null) => void;
  setOwnerOverview: (overview: RentOverviewItem[]) => void;
  setRenterDueRent: (dueRent: RenterDueRent | null) => void;
  setFilters: (filters: RentFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOffline: (offline: boolean) => void;
  clearRents: () => void;
  cacheRents: (data: RentListResponse) => Promise<void>;
  getCachedRents: () => Promise<RentListResponse | null>;
}

type RentsStore = RentsState & RentsActions;

const initialState: RentsState = {
  rentRecords: [],
  selectedRent: null,
  ownerOverview: [],
  renterDueRent: null,
  filters: {},
  isLoading: false,
  error: null,
  lastFetched: null,
  isOffline: false,
};

export const useRentsStore = create<RentsStore>((set, get) => ({
  ...initialState,

  setRentRecords: (rentRecords) =>
    set({
      rentRecords,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSelectedRent: (selectedRent) =>
    set({
      selectedRent,
      isLoading: false,
      error: null,
    }),

  setOwnerOverview: (ownerOverview) =>
    set({
      ownerOverview,
      isLoading: false,
      error: null,
    }),

  setRenterDueRent: (renterDueRent) =>
    set({
      renterDueRent,
      isLoading: false,
      error: null,
    }),

  setFilters: (filters) =>
    set({
      filters: { ...get().filters, ...filters },
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  setOffline: (isOffline) =>
    set({
      isOffline,
    }),

  clearRents: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  cacheRents: async (data) => {
    try {
      const list = data.results || [];
      await mmkvStorage.setItem(
        'rents_cache',
        JSON.stringify({ data: list, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedRents: async (): Promise<RentListResponse | null> => {
    try {
      const cached = await mmkvStorage.getItem('rents_cache');
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: RentRecord[]; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem('rents_cache');
        return null;
      }
      return { results: parsed.data, count: parsed.data.length, next: null, previous: null } as RentListResponse;
    } catch {
      return null;
    }
  },
}));
