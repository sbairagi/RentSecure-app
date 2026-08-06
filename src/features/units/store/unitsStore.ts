import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type { FeatureAccess, SubscriptionLimits, Unit, UnitListResponse } from '../types/units';

interface UnitsState {
  units: Unit[];
  selectedUnit: Unit | null;
  subscriptionLimits: SubscriptionLimits | null;
  featureAccess: FeatureAccess | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface UnitsActions {
  setUnits: (units: Unit[]) => void;
  setSelectedUnit: (unit: Unit | null) => void;
  setSubscriptionLimits: (limits: SubscriptionLimits | null) => void;
  setFeatureAccess: (access: FeatureAccess | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUnits: () => void;
  initUnits: () => Promise<void>;
  cacheUnits: (data: UnitListResponse) => Promise<void>;
  getCachedUnits: () => Promise<UnitListResponse | null>;
}

type UnitsStore = UnitsState & UnitsActions;

const initialState: UnitsState = {
  units: [],
  selectedUnit: null,
  subscriptionLimits: null,
  featureAccess: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useUnitsStore = create<UnitsStore>((set, get) => ({
  ...initialState,

  setUnits: (units) =>
    set({
      units,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSelectedUnit: (selectedUnit) =>
    set({
      selectedUnit,
      isLoading: false,
      error: null,
    }),

  setSubscriptionLimits: (subscriptionLimits) =>
    set({
      subscriptionLimits,
    }),

  setFeatureAccess: (featureAccess) =>
    set({
      featureAccess,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearUnits: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  initUnits: async () => {
    try {
      const cached = await get().getCachedUnits();
      if (cached) {
        const list = Array.isArray(cached) ? cached : cached.results || [];
        set({ units: list, isLoading: false, lastFetched: Date.now() });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  cacheUnits: async (data) => {
    try {
      const list = Array.isArray(data) ? data : data.results || [];
      await mmkvStorage.setItem(
        'units_cache',
        JSON.stringify({ data: list, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedUnits: async (): Promise<UnitListResponse | null> => {
    try {
      const cached = await mmkvStorage.getItem('units_cache');
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: Unit[]; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem('units_cache');
        return null;
      }
      return { results: parsed.data } as UnitListResponse;
    } catch {
      return null;
    }
  },
}));
