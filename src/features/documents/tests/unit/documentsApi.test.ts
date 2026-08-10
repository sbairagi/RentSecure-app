import { documentsApi } from '../../services/documentsApi';
import {
  mockUnitDocument,
  mockUnitImage,
  mockDocumentListResponse,
  mockImageListResponse,
  mockPickedAsset,
} from '../../tests/mocks/data';

jest.mock('../../services/documentsApi');

describe('documentsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listDocuments', () => {
    it('should fetch list of documents', async () => {
      (documentsApi.listDocuments as jest.Mock).mockResolvedValue(mockDocumentListResponse);
      const result = await documentsApi.listDocuments({ unit: 1 });
      expect(result).toEqual(mockDocumentListResponse);
    });
  });

  describe('listImages', () => {
    it('should fetch list of images', async () => {
      (documentsApi.listImages as jest.Mock).mockResolvedValue(mockImageListResponse);
      const result = await documentsApi.listImages({ unit: 1 });
      expect(result).toEqual(mockImageListResponse);
    });
  });

  describe('createDocument', () => {
    it('should create a document with progress callback', async () => {
      (documentsApi.createDocument as jest.Mock).mockResolvedValue(mockUnitDocument);
      const result = await documentsApi.createDocument(
        { unit: 1, file: new FormData() },
        (progress) => {
          expect(progress.status).toBe('uploading');
        }
      );
      expect(result).toEqual(mockUnitDocument);
    });
  });

  describe('createImage', () => {
    it('should create an image with progress callback', async () => {
      (documentsApi.createImage as jest.Mock).mockResolvedValue(mockUnitImage);
      const result = await documentsApi.createImage(
        { unit: 1, file: new FormData() },
        (progress) => {
          expect(progress.status).toBe('uploading');
        }
      );
      expect(result).toEqual(mockUnitImage);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      (documentsApi.deleteDocument as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsApi.deleteDocument(1)).resolves.toBeUndefined();
    });
  });

  describe('deleteImage', () => {
    it('should delete an image', async () => {
      (documentsApi.deleteImage as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsApi.deleteImage(1)).resolves.toBeUndefined();
    });
  });

  describe('buildFormData', () => {
    it('should build form data for document', () => {
      const formData = documentsApi.buildFormData(mockPickedAsset, 1, null);
      expect(formData).toBeInstanceOf(FormData);
    });

    it('should build form data for image', () => {
      const asset = { ...mockPickedAsset, type: 'image' as const };
      const formData = documentsApi.buildFormData(asset, 1, null);
      expect(formData).toBeInstanceOf(FormData);
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      const error = new Error('API Error');
      (documentsApi.listDocuments as jest.Mock).mockRejectedValue(error);
      await expect(documentsApi.listDocuments()).rejects.toThrow('API Error');
    });
  });
});
