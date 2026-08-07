import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import type { Caretaker, CaretakerListResponse } from '../types/caretakers';

interface CaretakersState {
  caretakers: Caretaker[];
  selectedCaretaker: Caretaker | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface CaretakersActions {
  setCaretakers: (caretakers: Caretaker[]) => void;
  setSelectedCaretaker: (caretaker: Caretaker | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCaretakers: () => void;
  initCaretakers: () => Promise<void>;
  cacheCaretakers: (data: Caretaker[] | CaretakerListResponse) => Promise<void>;
  getCachedCaretakers: () => Promise<CaretakerListResponse | null>;
}

type CaretakersStore = CaretakersState & CaretakersActions;

const initialState: CaretakersState = {
  caretakers: [],
  selectedCaretaker: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const useCaretakersStore = create<CaretakersStore>((set, get) => ({
  ...initialState,

  setCaretakers: (caretakers) =>
    set({
      caretakers,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSelectedCaretaker: (selectedCaretaker) =>
    set({
      selectedCaretaker,
      isLoading: false,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  clearCaretakers: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  initCaretakers: async () => {
    try {
      const cached = await get().getCachedCaretakers();
      if (cached) {
        const list = Array.isArray(cached) ? cached : cached.results || [];
        set({ caretakers: list, isLoading: false, lastFetched: Date.now() });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  cacheCaretakers: async (data) => {
    try {
      const list = Array.isArray(data) ? data : data.results || [];
      await mmkvStorage.setItem(
        'caretakers_cache',
        JSON.stringify({ data: list, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedCaretakers: async (): Promise<CaretakerListResponse | null> => {
    try {
      const cached = await mmkvStorage.getItem('caretakers_cache');
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: Caretaker[]; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem('caretakers_cache');
        return null;
      }
      return { results: parsed.data } as CaretakerListResponse;
    } catch {
      return null;
    }
  },
}));
