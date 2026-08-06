import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  FeatureAccess,
  Renter,
  RenterListResponse,
  SubscriptionLimits,
} from '../types/renters';

interface RentersState {
  renters: Renter[];
  selectedRenter: Renter | null;
  subscriptionLimits: SubscriptionLimits | null;
  featureAccess: FeatureAccess | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface RentersActions {
  setRenters: (renters: Renter[]) => void;
  setSelectedRenter: (renter: Renter | null) => void;
  setSubscriptionLimits: (limits: SubscriptionLimits | null) => void;
  setFeatureAccess: (access: FeatureAccess | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearRenters: () => void;
  initRenters: () => Promise<void>;
  cacheRenters: (data: RenterListResponse) => Promise<void>;
  getCachedRenters: () => Promise<RenterListResponse | null>;
}

type RentersStore = RentersState & RentersActions;

const initialState: RentersState = {
  renters: [],
  selectedRenter: null,
  subscriptionLimits: null,
  featureAccess: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useRentersStore = create<RentersStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setRenters: (renters) =>
        set({
          renters,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
        }),

      setSelectedRenter: (selectedRenter) =>
        set({
          selectedRenter,
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

      clearRenters: () =>
        set({
          ...initialState,
          isLoading: false,
        }),

      initRenters: async () => {
        try {
          const cached = await get().getCachedRenters();
          if (cached) {
            const list = Array.isArray(cached) ? cached : cached.results || [];
            set({ renters: list, isLoading: false, lastFetched: Date.now() });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      cacheRenters: async (data) => {
        try {
          const list = Array.isArray(data) ? data : data.results || [];
          await mmkvStorage.setItem(
            'renters_cache',
            JSON.stringify({ data: list, timestamp: Date.now() })
          );
        } catch {
          // Ignore cache errors
        }
      },

      getCachedRenters: async (): Promise<RenterListResponse | null> => {
        try {
          const cached = await mmkvStorage.getItem('renters_cache');
          if (!cached) return null;
          const parsed = JSON.parse(cached) as { data: Renter[]; timestamp: number };
          const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
          if (isStale) {
            await mmkvStorage.removeItem('renters_cache');
            return null;
          }
          return { results: parsed.data } as RenterListResponse;
        } catch {
          return null;
        }
      },
    }),
    { name: 'RentersStore' }
  )
);
