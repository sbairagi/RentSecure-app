import { documentsRepository } from '../../repository/documentsRepository';
import {
  mockDocument,
  mockDocumentListResponse,
  mockDocumentShareResponse,
  mockDocumentVersion,
  mockDocumentUsageLimits,
  mockFolderNode,
} from '../../tests/mocks/data';

jest.mock('../../repository/documentsRepository');

describe('documentsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchDocuments', () => {
    it('should fetch documents with filters', async () => {
      (documentsRepository.fetchDocuments as jest.Mock).mockResolvedValue(mockDocumentListResponse);
      const result = await documentsRepository.fetchDocuments({ type: 'pdf' });
      expect(result).toEqual(mockDocumentListResponse);
    });
  });

  describe('fetchDocument', () => {
    it('should fetch a single document', async () => {
      (documentsRepository.fetchDocument as jest.Mock).mockResolvedValue(mockDocument);
      const result = await documentsRepository.fetchDocument(1);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('createDocument', () => {
    it('should create a document', async () => {
      (documentsRepository.createDocument as jest.Mock).mockResolvedValue(mockDocument);
      const result = await documentsRepository.createDocument({ name: 'test.pdf', file: new FormData() });
      expect(result).toEqual(mockDocument);
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
      (documentsRepository.updateDocument as jest.Mock).mockResolvedValue({ ...mockDocument, name: 'updated.pdf' });
      const result = await documentsRepository.updateDocument(1, { name: 'updated.pdf' });
      expect(result.name).toBe('updated.pdf');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      (documentsRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsRepository.deleteDocument(1)).resolves.toBeUndefined();
    });
  });

  describe('bulkDelete', () => {
    it('should bulk delete documents', async () => {
      (documentsRepository.bulkDelete as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsRepository.bulkDelete([1, 2, 3])).resolves.toBeUndefined();
    });
  });

  describe('bulkMove', () => {
    it('should bulk move documents', async () => {
      (documentsRepository.bulkMove as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsRepository.bulkMove([1, 2], 5)).resolves.toBeUndefined();
    });
  });

  describe('shareDocument', () => {
    it('should share a document', async () => {
      (documentsRepository.shareDocument as jest.Mock).mockResolvedValue(mockDocumentShareResponse);
      const result = await documentsRepository.shareDocument(1, { visibility: 'shared' });
      expect(result).toEqual(mockDocumentShareResponse);
    });
  });

  describe('getVersions', () => {
    it('should fetch versions', async () => {
      (documentsRepository.getVersions as jest.Mock).mockResolvedValue([mockDocumentVersion]);
      const result = await documentsRepository.getVersions(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('getUsageLimits', () => {
    it('should fetch usage limits', async () => {
      (documentsRepository.getUsageLimits as jest.Mock).mockResolvedValue(mockDocumentUsageLimits);
      const result = await documentsRepository.getUsageLimits();
      expect(result).toEqual(mockDocumentUsageLimits);
    });
  });

  describe('getFolders', () => {
    it('should fetch folders', async () => {
      (documentsRepository.getFolders as jest.Mock).mockResolvedValue([mockFolderNode]);
      const result = await documentsRepository.getFolders();
      expect(result).toHaveLength(1);
    });
  });
});
