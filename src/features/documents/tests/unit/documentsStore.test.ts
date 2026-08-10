import { useDocumentsStore } from '../../store/documentsStore';
import type { UnitDocument, UnitImage } from '../../types/documents';

const mockUnitDocument: UnitDocument = {
  id: 1,
  unit: 1,
  renter: null,
  document: '/media/unit_documents/2024/01/15/test.pdf',
  file_hash: 'a1b2c3d4e5f6',
  uploaded_at: '2024-01-15T10:00:00Z',
};

const mockUnitImage: UnitImage = {
  id: 1,
  unit: 1,
  renter: null,
  image: '/media/unit_images/2024/01/15/test.jpg',
  image_hash: 'f6e5d4c3b2a1',
  uploaded_at: '2024-01-15T10:00:00Z',
};

describe('documentsStore', () => {
  beforeEach(() => {
    useDocumentsStore.setState({
      documents: [],
      images: [],
      selectedDocument: null,
      selectedImage: null,
      filters: {},
      uploadProgress: null,
      isLoading: false,
      error: null,
      lastFetched: null,
    });
    jest.clearAllMocks();
  });

  describe('setDocuments', () => {
    it('should set documents', () => {
      useDocumentsStore.getState().setDocuments([mockUnitDocument]);
      const state = useDocumentsStore.getState();
      expect(state.documents).toHaveLength(1);
      expect(state.documents[0].id).toBe(1);
    });
  });

  describe('setImages', () => {
    it('should set images', () => {
      useDocumentsStore.getState().setImages([mockUnitImage]);
      const state = useDocumentsStore.getState();
      expect(state.images).toHaveLength(1);
      expect(state.images[0].id).toBe(1);
    });
  });

  describe('setSelectedDocument', () => {
    it('should set selected document', () => {
      useDocumentsStore.getState().setSelectedDocument(mockUnitDocument);
      const state = useDocumentsStore.getState();
      expect(state.selectedDocument?.id).toBe(1);
    });
  });

  describe('setSelectedImage', () => {
    it('should set selected image', () => {
      useDocumentsStore.getState().setSelectedImage(mockUnitImage);
      const state = useDocumentsStore.getState();
      expect(state.selectedImage?.id).toBe(1);
    });
  });

  describe('setFilters', () => {
    it('should merge filters', () => {
      useDocumentsStore.getState().setFilters({ unit: 1 });
      useDocumentsStore.getState().setFilters({ renter: 2 });
      const state = useDocumentsStore.getState();
      expect(state.filters.unit).toBe(1);
      expect(state.filters.renter).toBe(2);
    });
  });

  describe('setUploadProgress', () => {
    it('should set upload progress', () => {
      useDocumentsStore.getState().setUploadProgress({
        loaded: 50,
        total: 100,
        progress: 50,
        status: 'uploading',
      });
      const state = useDocumentsStore.getState();
      expect(state.uploadProgress?.progress).toBe(50);
      expect(state.uploadProgress?.status).toBe('uploading');
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
      useDocumentsStore.getState().setDocuments([mockUnitDocument]);
      useDocumentsStore.getState().clearDocuments();
      const state = useDocumentsStore.getState();
      expect(state.documents).toHaveLength(0);
      expect(state.error).toBeNull();
    });
  });

  describe('clearImages', () => {
    it('should clear all state', () => {
      useDocumentsStore.getState().setImages([mockUnitImage]);
      useDocumentsStore.getState().clearImages();
      const state = useDocumentsStore.getState();
      expect(state.images).toHaveLength(0);
      expect(state.error).toBeNull();
    });
  });
});
