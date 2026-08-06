import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type {
  Payment,
  PaymentAnalytics,
  PaymentFilters,
  PaymentListResponse,
  PaymentSummary,
} from '../types/payments';

interface PaymentsState {
  payments: Payment[];
  selectedPayment: Payment | null;
  summary: PaymentSummary | null;
  analytics: PaymentAnalytics | null;
  filters: PaymentFilters;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isOffline: boolean;
}

interface PaymentsActions {
  setPayments: (payments: Payment[]) => void;
  setSelectedPayment: (payment: Payment | null) => void;
  setSummary: (summary: PaymentSummary | null) => void;
  setAnalytics: (analytics: PaymentAnalytics | null) => void;
  setFilters: (filters: PaymentFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOffline: (offline: boolean) => void;
  clearPayments: () => void;
  cachePayments: (data: PaymentListResponse) => Promise<void>;
  getCachedPayments: () => Promise<PaymentListResponse | null>;
}

type PaymentsStore = PaymentsState & PaymentsActions;

const initialState: PaymentsState = {
  payments: [],
  selectedPayment: null,
  summary: null,
  analytics: null,
  filters: {},
  isLoading: false,
  error: null,
  lastFetched: null,
  isOffline: false,
};

export const usePaymentsStore = create<PaymentsStore>((set, get) => ({
  ...initialState,

  setPayments: (payments) =>
    set({
      payments,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSelectedPayment: (selectedPayment) =>
    set({
      selectedPayment,
      isLoading: false,
      error: null,
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

  clearPayments: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  cachePayments: async (data) => {
    try {
      const list = Array.isArray(data) ? data : data.results || [];
      await mmkvStorage.setItem(
        'payments_cache',
        JSON.stringify({ data: list, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedPayments: async (): Promise<PaymentListResponse | null> => {
    try {
      const cached = await mmkvStorage.getItem('payments_cache');
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: Payment[]; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem('payments_cache');
        return null;
      }
      return { results: parsed.data, count: parsed.data.length, next: null, previous: null } as PaymentListResponse;
    } catch {
      return null;
    }
  },
}));
