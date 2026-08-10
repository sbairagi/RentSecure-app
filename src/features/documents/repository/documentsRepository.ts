import { documentsApi } from '../services/documentsApi';
import type {
  UnitDocument,
  UnitImage,
  DocumentUploadPayload,
  DocumentUploadProgress,
  DocumentFilters,
  DocumentListResponse,
  PickedAsset,
} from '../types';

export const documentsRepository = {
  listDocuments: async (params?: DocumentFilters): Promise<DocumentListResponse> => {
    return documentsApi.listDocuments(params);
  },

  listImages: async (params?: DocumentFilters): Promise<DocumentListResponse> => {
    return documentsApi.listImages(params);
  },

  retrieveDocument: async (id: number | string): Promise<UnitDocument> => {
    return documentsApi.retrieveDocument(id);
  },

  retrieveImage: async (id: number | string): Promise<UnitImage> => {
    return documentsApi.retrieveImage(id);
  },

  createDocument: async (
    data: DocumentUploadPayload,
    onProgress?: (progress: DocumentUploadProgress) => void
  ): Promise<UnitDocument> => {
    return documentsApi.createDocument(data, onProgress);
  },

  createImage: async (
    data: DocumentUploadPayload,
    onProgress?: (progress: DocumentUploadProgress) => void
  ): Promise<UnitImage> => {
    return documentsApi.createImage(data, onProgress);
  },

  updateDocument: async (id: number | string, data: DocumentUploadPayload): Promise<UnitDocument> => {
    return documentsApi.updateDocument(id, data);
  },

  updateImage: async (id: number | string, data: DocumentUploadPayload): Promise<UnitImage> => {
    return documentsApi.updateImage(id, data);
  },

  deleteDocument: async (id: number | string): Promise<void> => {
    return documentsApi.deleteDocument(id);
  },

  deleteImage: async (id: number | string): Promise<void> => {
    return documentsApi.deleteImage(id);
  },

  buildFormData: (asset: PickedAsset, unit: number, renter?: number | null): FormData => {
    return documentsApi.buildFormData(asset, unit, renter);
  },
};
