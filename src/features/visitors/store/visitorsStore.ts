import { mmkvStorage } from "@/services/storage/mmkv";
import { create } from "zustand";
import type { Visitor, VisitorListResponse, VisitorStatsResponse } from "../types/visitors";

interface VisitorsState {
  visitors: Visitor[];
  selectedVisitor: Visitor | null;
  stats: VisitorStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  filters: Record<string, unknown>;
}

interface VisitorsActions {
  setVisitors: (visitors: Visitor[]) => void;
  setSelectedVisitor: (visitor: Visitor | null) => void;
  setStats: (stats: VisitorStatsResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  clearVisitors: () => void;
  clearSelectedVisitor: () => void;
  initVisitors: () => Promise<void>;
  cacheVisitors: (data: Visitor[] | VisitorListResponse) => Promise<void>;
  getCachedVisitors: () => Promise<VisitorListResponse | null>;
  cacheSelectedVisitor: (visitor: Visitor) => Promise<void>;
  getCachedSelectedVisitor: (id: number | string) => Promise<Visitor | null>;
}

type VisitorsStore = VisitorsState & VisitorsActions;

const initialState: VisitorsState = {
  visitors: [],
  selectedVisitor: null,
  stats: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  filters: {},
};

export const useVisitorsStore = create<VisitorsStore>((set, get) => ({
  ...initialState,

  setVisitors: (visitors) =>
    set({
      visitors,
      isLoading: false,
      error: null,
      lastFetched: Date.now(),
    }),

  setSelectedVisitor: (selectedVisitor) =>
    set({
      selectedVisitor,
      isLoading: false,
      error: null,
    }),

  setStats: (stats) =>
    set({
      stats,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  setFilters: (filters) =>
    set({
      filters,
    }),

  clearVisitors: () =>
    set({
      ...initialState,
      isLoading: false,
    }),

  clearSelectedVisitor: () =>
    set({
      selectedVisitor: null,
      isLoading: false,
    }),

  initVisitors: async () => {
    try {
      const cached = await get().getCachedVisitors();
      if (cached) {
        const list = Array.isArray(cached) ? cached : cached.results || [];
        set({ visitors: list, isLoading: false, lastFetched: Date.now() });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  cacheVisitors: async (data) => {
    try {
      const list = Array.isArray(data) ? data : data.results || [];
      await mmkvStorage.setItem(
        "visitors_cache",
        JSON.stringify({ data: list, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedVisitors: async (): Promise<VisitorListResponse | null> => {
    try {
      const cached = await mmkvStorage.getItem("visitors_cache");
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: Visitor[]; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem("visitors_cache");
        return null;
      }
      return { results: parsed.data } as VisitorListResponse;
    } catch {
      return null;
    }
  },

  cacheSelectedVisitor: async (visitor) => {
    try {
      await mmkvStorage.setItem(
        `visitor_${visitor.id}`,
        JSON.stringify({ data: visitor, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  },

  getCachedSelectedVisitor: async (id: number | string): Promise<Visitor | null> => {
    try {
      const cached = await mmkvStorage.getItem(`visitor_${id}`);
      if (!cached) return null;
      const parsed = JSON.parse(cached) as { data: Visitor; timestamp: number };
      const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000;
      if (isStale) {
        await mmkvStorage.removeItem(`visitor_${id}`);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  },
}));
