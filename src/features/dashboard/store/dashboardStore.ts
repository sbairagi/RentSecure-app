import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type { DashboardAnalytics, DashboardResponse, DashboardSummary } from '../types/dashboard';

const DASHBOARD_CACHE_KEY = 'dashboard_cache';
const DASHBOARD_CACHE_TTL = 5 * 60 * 1000;

interface DashboardState {
  data: DashboardResponse | null;
  summary: DashboardSummary | null;
  analytics: DashboardAnalytics | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isOffline: boolean;
}

interface DashboardActions {
  setData: (data: DashboardResponse) => void;
  setSummary: (summary: DashboardSummary) => void;
  setAnalytics: (analytics: DashboardAnalytics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOffline: (offline: boolean) => void;
  clearDashboard: () => void;
  initDashboard: () => Promise<void>;
  cacheData: (data: DashboardResponse) => Promise<void>;
  getCachedData: () => Promise<DashboardResponse | null>;
}

type DashboardStore = DashboardState & DashboardActions;

const initialState: DashboardState = {
  data: null,
  summary: null,
  analytics: null,
  isLoading: true,
  error: null,
  lastFetched: null,
  isOffline: false,
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  ...initialState,

  setData: (data) =>
    set({
      data,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSummary: (summary) =>
    set({
      summary,
      isLoading: false,
      error: null,
    }),

  setAnalytics: (analytics) =>
    set({
      analytics,
      isLoading: false,
      error: null,
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

  clearDashboard: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  initDashboard: async () => {
    try {
      const cached = await get().getCachedData();
      if (cached) {
        set({ data: cached, isLoading: false, lastFetched: Date.now() });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  cacheData: async (data) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now(),
        staleTime: DASHBOARD_CACHE_TTL,
        cacheTime: DASHBOARD_CACHE_TTL,
      };
      await mmkvStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(cacheEntry));
    } catch {
      // Ignore cache errors
    }
  },

  getCachedData: async (): Promise<DashboardResponse | null> => {
    try {
      const cached = await mmkvStorage.getItem(DASHBOARD_CACHE_KEY);
      if (!cached) return null;
      const cacheEntry = JSON.parse(cached) as {
        data: DashboardResponse;
        timestamp: number;
        staleTime: number;
      };
      const isStale = Date.now() - cacheEntry.timestamp > cacheEntry.staleTime;
      if (isStale) {
        await mmkvStorage.removeItem(DASHBOARD_CACHE_KEY);
        return null;
      }
      return cacheEntry.data;
    } catch {
      return null;
    }
  },
}));
