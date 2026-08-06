import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Document,
  DocumentFilters,
  DocumentListResponse,
  DocumentUploadProgress,
  DocumentUsageLimits,
} from '../types';

interface DocumentsState {
  documents: Document[];
  selectedDocument: Document | null;
  usageLimits: DocumentUsageLimits | null;
  filters: DocumentFilters;
  uploadProgress: DocumentUploadProgress | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  selectedIds: Set<number | string>;
  isSelectionMode: boolean;
}

interface DocumentsActions {
  setDocuments: (documents: Document[]) => void;
  setSelectedDocument: (document: Document | null) => void;
  setUsageLimits: (limits: DocumentUsageLimits | null) => void;
  setFilters: (filters: Partial<DocumentFilters>) => void;
  setUploadProgress: (progress: DocumentUploadProgress | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearDocuments: () => void;
  toggleSelection: (id: number | string) => void;
  selectAll: (ids: (number | string)[]) => void;
  clearSelection: () => void;
  setSelectionMode: (isSelectionMode: boolean) => void;
  initDocuments: () => Promise<void>;
  cacheDocuments: (data: DocumentListResponse) => Promise<void>;
  getCachedDocuments: () => Promise<DocumentListResponse | null>;
}

type DocumentsStore = DocumentsState & DocumentsActions;

const initialState: DocumentsState = {
  documents: [],
  selectedDocument: null,
  usageLimits: null,
  filters: {},
  uploadProgress: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  selectedIds: new Set(),
  isSelectionMode: false,
};

export const useDocumentsStore = create<DocumentsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setDocuments: (documents) =>
        set({
          documents,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
        }),

      setSelectedDocument: (selectedDocument) =>
        set({
          selectedDocument,
          isLoading: false,
          error: null,
        }),

      setUsageLimits: (usageLimits) =>
        set({
          usageLimits,
        }),

      setFilters: (filters) =>
        set({
          filters: { ...get().filters, ...filters },
        }),

      setUploadProgress: (uploadProgress) =>
        set({
          uploadProgress,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      clearDocuments: () =>
        set({
          ...initialState,
          isLoading: false,
        }),

      toggleSelection: (id) =>
        set((state) => {
          const newSelection = new Set(state.selectedIds);
          if (newSelection.has(id)) {
            newSelection.delete(id);
          } else {
            newSelection.add(id);
          }
          return {
            selectedIds: newSelection,
            isSelectionMode: newSelection.size > 0,
          };
        }),

      selectAll: (ids) =>
        set({
          selectedIds: new Set(ids),
          isSelectionMode: true,
        }),

      clearSelection: () =>
        set({
          selectedIds: new Set(),
          isSelectionMode: false,
        }),

      setSelectionMode: (isSelectionMode) =>
        set({
          isSelectionMode,
          selectedIds: isSelectionMode ? get().selectedIds : new Set(),
        }),

      initDocuments: async () => {
        try {
          const cached = await get().getCachedDocuments();
          if (cached) {
            const list = Array.isArray(cached) ? cached : cached.results || [];
            set({ documents: list, isLoading: false, lastFetched: Date.now() });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      cacheDocuments: async (data) => {
        try {
          const list = Array.isArray(data) ? data : data.results || [];
          await mmkvStorage.setItem(
            'documents_cache',
            JSON.stringify({ data: list, timestamp: Date.now() })
          );
        } catch {
          // Ignore cache errors
        }
      },

      getCachedDocuments: async (): Promise<DocumentListResponse | null> => {
        try {
          const cached = await mmkvStorage.getItem('documents_cache');
          if (!cached) return null;
          const parsed = JSON.parse(cached) as { data: Document[]; timestamp: number };
          const isStale = Date.now() - parsed.timestamp > 2 * 60 * 1000;
          if (isStale) {
            await mmkvStorage.removeItem('documents_cache');
            return null;
          }
          return { results: parsed.data } as DocumentListResponse;
        } catch {
          return null;
        }
      },
    }),
    { name: 'DocumentsStore' }
  )
);
