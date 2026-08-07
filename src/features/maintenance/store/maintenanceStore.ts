import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type { MaintenanceRequest, MaintenanceListResponse } from '../types/maintenance';

interface MaintenanceState {
  requests: MaintenanceRequest[];
  selectedRequest: MaintenanceRequest | null;
  dashboardStats: Record<string, any> | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface MaintenanceActions {
  setRequests: (requests: MaintenanceRequest[]) => void;
  setSelectedRequest: (request: MaintenanceRequest | null) => void;
  setDashboardStats: (stats: Record<string, any> | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRequests: () => void;
  initMaintenance: () => Promise<void>;
  cacheRequests: (data: MaintenanceRequest[] | MaintenanceListResponse) => Promise<void>;
  getCachedRequests: () => Promise<MaintenanceListResponse | null>;
}

type MaintenanceStore = MaintenanceState & MaintenanceActions;

const initialState: MaintenanceState = {
  requests: [],
  selectedRequest: null,
  dashboardStats: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  ...initialState,

  setRequests: (requests) =>
    set({
      requests,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSelectedRequest: (selectedRequest) =>
    set({
      selectedRequest,
      isLoading: false,
      error: null,
    }),

  setDashboardStats: (dashboardStats) =>
    set({
      dashboardStats,
      isLoading: false,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearRequests: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  initMaintenance: async () => {
    try {
      const cached = await get().getCachedRequests();
      if (cached) {
        const list = Array.isArray(cached) ? cached : cached.results || [];
        set({ requests: list, isLoading: false, lastFetched: Date.now() });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  cacheRequests: async (data) => {
    try {
      const list = Array.isArray(data) ? data : data.results || [];
      await mmkvStorage.setItem(
        'maintenance_requests_cache',
        JSON.stringify({ data: list, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedRequests: async (): Promise<MaintenanceListResponse | null> => {
    try {
      const cached = await mmkvStorage.getItem('maintenance_requests_cache');
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: MaintenanceRequest[]; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem('maintenance_requests_cache');
        return null;
      }
      return { results: parsed.data } as MaintenanceListResponse;
    } catch {
      return null;
    }
  },
}));
