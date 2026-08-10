import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  UnitDocument,
  UnitImage,
  DocumentFilters,
  DocumentUploadProgress,
} from '../types';

interface DocumentsState {
  documents: UnitDocument[];
  images: UnitImage[];
  selectedDocument: UnitDocument | null;
  selectedImage: UnitImage | null;
  filters: DocumentFilters;
  uploadProgress: DocumentUploadProgress | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface DocumentsActions {
  setDocuments: (documents: UnitDocument[]) => void;
  setImages: (images: UnitImage[]) => void;
  setSelectedDocument: (document: UnitDocument | null) => void;
  setSelectedImage: (image: UnitImage | null) => void;
  setFilters: (filters: Partial<DocumentFilters>) => void;
  setUploadProgress: (progress: DocumentUploadProgress | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearDocuments: () => void;
  clearImages: () => void;
}

type DocumentsStore = DocumentsState & DocumentsActions;

const initialState: DocumentsState = {
  documents: [],
  images: [],
  selectedDocument: null,
  selectedImage: null,
  filters: {},
  uploadProgress: null,
  isLoading: false,
  error: null,
  lastFetched: null,
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

      setImages: (images) =>
        set({
          images,
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

      setSelectedImage: (selectedImage) =>
        set({
          selectedImage,
          isLoading: false,
          error: null,
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

      clearImages: () =>
        set({
          ...initialState,
          isLoading: false,
        }),
    }),
    { name: 'DocumentsStore' }
  )
);
