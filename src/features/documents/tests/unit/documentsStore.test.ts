import { useDocumentsStore } from '../../store/documentsStore';
import type { Document } from '../../types/documents';

const mockDocument: Document = {
  id: 1,
  owner: 1,
  parent: null,
  name: 'test.pdf',
  file: '/media/test.pdf',
  file_hash: 'abc123',
  mime_type: 'application/pdf',
  size: 1024,
  document_type: 'pdf',
  thumbnail: null,
  is_favorite: false,
  is_archived: false,
  is_shared: false,
  share_token: null,
  metadata: {},
  version: 1,
  previous_version: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('documentsStore', () => {
  beforeEach(() => {
    useDocumentsStore.setState({
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
    });
    jest.clearAllMocks();
  });

  describe('setDocuments', () => {
    it('should set documents', () => {
      useDocumentsStore.getState().setDocuments([mockDocument]);
      const state = useDocumentsStore.getState();
      expect(state.documents).toHaveLength(1);
      expect(state.documents[0].id).toBe(1);
    });
  });

  describe('setSelectedDocument', () => {
    it('should set selected document', () => {
      useDocumentsStore.getState().setSelectedDocument(mockDocument);
      const state = useDocumentsStore.getState();
      expect(state.selectedDocument?.id).toBe(1);
    });
  });

  describe('setFilters', () => {
    it('should merge filters', () => {
      useDocumentsStore.getState().setFilters({ type: 'pdf' });
      useDocumentsStore.getState().setFilters({ is_favorite: true });
      const state = useDocumentsStore.getState();
      expect(state.filters.type).toBe('pdf');
      expect(state.filters.is_favorite).toBe(true);
    });
  });

  describe('toggleSelection', () => {
    it('should toggle document selection', () => {
      useDocumentsStore.getState().toggleSelection(1);
      expect(useDocumentsStore.getState().selectedIds.has(1)).toBe(true);
      useDocumentsStore.getState().toggleSelection(1);
      expect(useDocumentsStore.getState().selectedIds.has(1)).toBe(false);
    });
  });

  describe('selectAll', () => {
    it('should select all documents', () => {
      useDocumentsStore.getState().selectAll([1, 2, 3]);
      const state = useDocumentsStore.getState();
      expect(state.selectedIds.size).toBe(3);
      expect(state.isSelectionMode).toBe(true);
    });
  });

  describe('clearSelection', () => {
    it('should clear selection', () => {
      useDocumentsStore.getState().selectAll([1, 2]);
      useDocumentsStore.getState().clearSelection();
      const state = useDocumentsStore.getState();
      expect(state.selectedIds.size).toBe(0);
      expect(state.isSelectionMode).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      useDocumentsStore.getState().setLoading(true);
      expect(useDocumentsStore.getState().isLoading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error state', () => {
      useDocumentsStore.getState().setError('Test error');
      const state = useDocumentsStore.getState();
      expect(state.error).toBe('Test error');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('clearDocuments', () => {
    it('should clear all state', () => {
      useDocumentsStore.getState().setDocuments([mockDocument]);
      useDocumentsStore.getState().clearDocuments();
      const state = useDocumentsStore.getState();
      expect(state.documents).toHaveLength(0);
      expect(state.error).toBeNull();
    });
  });

  describe('initDocuments', () => {
    it('should initialize from cache', async () => {
      const { mmkvStorage } = await import('@/services/storage/mmkv');
      jest.spyOn(mmkvStorage, 'getItem').mockResolvedValue(
        JSON.stringify({ data: [mockDocument], timestamp: Date.now() })
      );
      await useDocumentsStore.getState().initDocuments();
      const state = useDocumentsStore.getState();
      expect(state.documents).toHaveLength(1);
    });
  });
});
