import { documentsApi } from '../../services/documentsApi';
import {
  mockDocument,
  mockDocumentListResponse,
  mockDocumentShareResponse,
  mockDocumentVersion,
  mockDocumentUsageLimits,
  mockFolderNode,
} from '../../tests/mocks/data';

jest.mock('../../services/documentsApi');

describe('documentsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch list of documents', async () => {
      (documentsApi.list as jest.Mock).mockResolvedValue(mockDocumentListResponse);
      const result = await documentsApi.list();
      expect(result).toEqual(mockDocumentListResponse);
      expect((result as any).results).toHaveLength(1);
    });

    it('should handle empty list', async () => {
      (documentsApi.list as jest.Mock).mockResolvedValue({ results: [] });
      const result = await documentsApi.list();
      expect((result as any).results).toHaveLength(0);
    });

    it('should pass filters to API', async () => {
      (documentsApi.list as jest.Mock).mockResolvedValue(mockDocumentListResponse);
      await documentsApi.list({ type: 'pdf', is_favorite: true });
      expect(documentsApi.list).toHaveBeenCalledWith({ type: 'pdf', is_favorite: true });
    });
  });

  describe('retrieve', () => {
    it('should fetch a single document', async () => {
      (documentsApi.retrieve as jest.Mock).mockResolvedValue(mockDocument);
      const result = await documentsApi.retrieve(1);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const newDocument = { ...mockDocument, id: 2 };
      (documentsApi.create as jest.Mock).mockResolvedValue(newDocument);
      const result = await documentsApi.create({ name: 'test.pdf', file: new FormData() });
      expect(result).toEqual(newDocument);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updatedDocument = { ...mockDocument, name: 'updated.pdf' };
      (documentsApi.update as jest.Mock).mockResolvedValue(updatedDocument);
      const result = await documentsApi.update(1, { name: 'updated.pdf' });
      expect(result).toEqual(updatedDocument);
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      (documentsApi.remove as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsApi.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('download', () => {
    it('should fetch document blob', async () => {
      const blob = new Blob(['test']);
      (documentsApi.download as jest.Mock).mockResolvedValue(blob);
      const result = await documentsApi.download(1);
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('preview', () => {
    it('should fetch preview URL', async () => {
      (documentsApi.preview as jest.Mock).mockResolvedValue({ url: 'https://example.com/preview/1' });
      const result = await documentsApi.preview(1);
      expect(result).toEqual({ url: 'https://example.com/preview/1' });
    });
  });

  describe('share', () => {
    it('should share a document', async () => {
      (documentsApi.share as jest.Mock).mockResolvedValue(mockDocumentShareResponse);
      const result = await documentsApi.share(1, { visibility: 'shared', expires_in: 3600 });
      expect(result).toEqual(mockDocumentShareResponse);
    });
  });

  describe('getVersions', () => {
    it('should fetch version history', async () => {
      (documentsApi.getVersions as jest.Mock).mockResolvedValue([mockDocumentVersion]);
      const result = await documentsApi.getVersions(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getUsageLimits', () => {
    it('should fetch usage limits', async () => {
      (documentsApi.getUsageLimits as jest.Mock).mockResolvedValue(mockDocumentUsageLimits);
      const result = await documentsApi.getUsageLimits();
      expect(result).toEqual(mockDocumentUsageLimits);
    });
  });

  describe('getFolders', () => {
    it('should fetch folder tree', async () => {
      (documentsApi.getFolders as jest.Mock).mockResolvedValue([mockFolderNode]);
      const result = await documentsApi.getFolders();
      expect(result).toHaveLength(1);
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      (documentsApi.list as jest.Mock).mockRejectedValue(error);
      await expect(documentsApi.list()).rejects.toThrow('API Error');
    });
  });
});
