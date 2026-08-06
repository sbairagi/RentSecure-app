import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Agreement,
  AgreementFilters,
  AgreementListResponse,
  FeatureAccess,
  SubscriptionLimits,
} from '../types/agreements';

interface AgreementsState {
  agreements: Agreement[];
  selectedAgreement: Agreement | null;
  subscriptionLimits: SubscriptionLimits | null;
  featureAccess: FeatureAccess | null;
  filters: AgreementFilters;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface AgreementsActions {
  setAgreements: (agreements: Agreement[]) => void;
  setSelectedAgreement: (agreement: Agreement | null) => void;
  setSubscriptionLimits: (limits: SubscriptionLimits | null) => void;
  setFeatureAccess: (access: FeatureAccess | null) => void;
  setFilters: (filters: AgreementFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAgreements: () => void;
  initAgreements: () => Promise<void>;
  cacheAgreements: (data: AgreementListResponse) => Promise<void>;
  getCachedAgreements: () => Promise<AgreementListResponse | null>;
}

type AgreementsStore = AgreementsState & AgreementsActions;

const initialState: AgreementsState = {
  agreements: [],
  selectedAgreement: null,
  subscriptionLimits: null,
  featureAccess: null,
  filters: {},
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useAgreementsStore = create<AgreementsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setAgreements: (agreements) =>
        set({
          agreements,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
        }),

      setSelectedAgreement: (selectedAgreement) =>
        set({
          selectedAgreement,
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

      clearAgreements: () =>
        set({
          ...initialState,
          isLoading: false,
        }),

      initAgreements: async () => {
        try {
          const cached = await get().getCachedAgreements();
          if (cached) {
            const list = Array.isArray(cached) ? cached : cached.results || [];
            set({ agreements: list, isLoading: false, lastFetched: Date.now() });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      cacheAgreements: async (data) => {
        try {
          const list = Array.isArray(data) ? data : data.results || [];
          await mmkvStorage.setItem(
            'agreements_cache',
            JSON.stringify({ data: list, timestamp: Date.now() })
          );
        } catch {
          // Ignore cache errors
        }
      },

      getCachedAgreements: async (): Promise<AgreementListResponse | null> => {
        try {
          const cached = await mmkvStorage.getItem('agreements_cache');
          if (!cached) return null;
          const parsed = JSON.parse(cached) as { data: Agreement[]; timestamp: number };
          const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
          if (isStale) {
            await mmkvStorage.removeItem('agreements_cache');
            return null;
          }
          return { results: parsed.data } as AgreementListResponse;
        } catch {
          return null;
        }
      },
    }),
    { name: 'AgreementsStore' }
  )
);
