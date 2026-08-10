import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type { Building } from '../types/buildings';

interface BuildingsState {
  buildings: Building[];
  selectedBuilding: Building | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface BuildingsActions {
  setBuildings: (buildings: Building[]) => void;
  setSelectedBuilding: (building: Building | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearBuildings: () => void;
  initBuildings: () => Promise<void>;
  cacheBuildings: (data: Building[]) => Promise<void>;
  getCachedBuildings: () => Promise<Building[] | null>;
}

type BuildingsStore = BuildingsState & BuildingsActions;

const initialState: BuildingsState = {
  buildings: [],
  selectedBuilding: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useBuildingsStore = create<BuildingsStore>((set, get) => ({
  ...initialState,

  setBuildings: (buildings) =>
    set({
      buildings,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSelectedBuilding: (selectedBuilding) =>
    set({
      selectedBuilding,
      isLoading: false,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearBuildings: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  initBuildings: async () => {
    try {
      const cached = await get().getCachedBuildings();
      if (cached) {
        set({ buildings: cached, isLoading: false, lastFetched: Date.now() });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  cacheBuildings: async (data) => {
    try {
      await mmkvStorage.setItem(
        'buildings_cache',
        JSON.stringify({ data: data, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedBuildings: async (): Promise<Building[] | null> => {
    try {
      const cached = await mmkvStorage.getItem('buildings_cache');
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: Building[]; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem('buildings_cache');
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  },
}));
