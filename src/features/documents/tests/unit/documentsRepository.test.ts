import { documentsRepository } from '../../repository/documentsRepository';
import { mockUnitDocument, mockUnitImage, mockDocumentListResponse, mockImageListResponse, mockPickedAsset } from '../../tests/mocks/data';

jest.mock('../../repository/documentsRepository');

describe('documentsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listDocuments', () => {
    it('should fetch documents with filters', async () => {
      (documentsRepository.listDocuments as jest.Mock).mockResolvedValue(mockDocumentListResponse);
      const result = await documentsRepository.listDocuments({ unit: 1 });
      expect(result).toEqual(mockDocumentListResponse);
    });
  });

  describe('listImages', () => {
    it('should fetch images with filters', async () => {
      (documentsRepository.listImages as jest.Mock).mockResolvedValue(mockImageListResponse);
      const result = await documentsRepository.listImages({ unit: 1 });
      expect(result).toEqual(mockImageListResponse);
    });
  });

  describe('createDocument', () => {
    it('should create a document', async () => {
      (documentsRepository.createDocument as jest.Mock).mockResolvedValue(mockUnitDocument);
      const result = await documentsRepository.createDocument(
        { unit: 1, file: new FormData() },
        (progress) => {
          expect(progress.status).toBe('uploading');
        }
      );
      expect(result).toEqual(mockUnitDocument);
    });
  });

  describe('createImage', () => {
    it('should create an image', async () => {
      (documentsRepository.createImage as jest.Mock).mockResolvedValue(mockUnitImage);
      const result = await documentsRepository.createImage(
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
      (documentsRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsRepository.deleteDocument(1)).resolves.toBeUndefined();
    });
  });

  describe('deleteImage', () => {
    it('should delete an image', async () => {
      (documentsRepository.deleteImage as jest.Mock).mockResolvedValue(undefined);
      await expect(documentsRepository.deleteImage(1)).resolves.toBeUndefined();
    });
  });

  describe('buildFormData', () => {
    it('should build form data for document', () => {
      const formData = documentsRepository.buildFormData(mockPickedAsset, 1, null);
      expect(formData).toBeInstanceOf(FormData);
    });

    it('should build form data for image', () => {
      const asset = { ...mockPickedAsset, type: 'image' as const };
      const formData = documentsRepository.buildFormData(asset, 1, null);
      expect(formData).toBeInstanceOf(FormData);
    });
  });
});
