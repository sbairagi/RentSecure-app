import { apiService } from '@/services/api/apiClient';
import { DOCUMENT_CONSTANTS } from '../constants/documents';
import type {
  UnitDocument,
  UnitImage,
  DocumentUploadPayload,
  DocumentUploadProgress,
  DocumentFilters,
  DocumentListResponse,
  PickedAsset,
} from '../types';

export const documentsApi = {
  listDocuments: async (params?: DocumentFilters): Promise<DocumentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.renter !== undefined && params?.renter !== null) searchParams.set('renter', String(params.renter));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    const query = searchParams.toString();
    return apiService.get<DocumentListResponse>(
      `${DOCUMENT_CONSTANTS.API.LIST_DOCUMENTS}${query ? `?${query}` : ''}`
    );
  },

  listImages: async (params?: DocumentFilters): Promise<DocumentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.unit) searchParams.set('unit', String(params.unit));
    if (params?.renter !== undefined && params?.renter !== null) searchParams.set('renter', String(params.renter));
    if (params?.search) searchParams.set('search', params.search);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    const query = searchParams.toString();
    return apiService.get<DocumentListResponse>(
      `${DOCUMENT_CONSTANTS.API.LIST_IMAGES}${query ? `?${query}` : ''}`
    );
  },

  retrieveDocument: async (id: number | string): Promise<UnitDocument> => {
    return apiService.get<UnitDocument>(DOCUMENT_CONSTANTS.API.DETAIL_DOCUMENT(id));
  },

  retrieveImage: async (id: number | string): Promise<UnitImage> => {
    return apiService.get<UnitImage>(DOCUMENT_CONSTANTS.API.DETAIL_IMAGE(id));
  },

  createDocument: async (payload: DocumentUploadPayload, onProgress?: (progress: DocumentUploadProgress) => void): Promise<UnitDocument> => {
    return apiService.upload<UnitDocument>(
      DOCUMENT_CONSTANTS.API.CREATE_DOCUMENT,
      payload.file,
      (percent) => {
        onProgress?.({
          loaded: percent,
          total: 100,
          progress: percent,
          status: percent < 100 ? 'uploading' : 'processing',
        });
      }
    );
  },

  createImage: async (payload: DocumentUploadPayload, onProgress?: (progress: DocumentUploadProgress) => void): Promise<UnitImage> => {
    return apiService.upload<UnitImage>(
      DOCUMENT_CONSTANTS.API.CREATE_IMAGE,
      payload.file,
      (percent) => {
        onProgress?.({
          loaded: percent,
          total: 100,
          progress: percent,
          status: percent < 100 ? 'uploading' : 'processing',
        });
      }
    );
  },

  updateDocument: async (id: number | string, payload: DocumentUploadPayload): Promise<UnitDocument> => {
    return apiService.upload<UnitDocument>(DOCUMENT_CONSTANTS.API.UPDATE_DOCUMENT(id), payload.file);
  },

  updateImage: async (id: number | string, payload: DocumentUploadPayload): Promise<UnitImage> => {
    return apiService.upload<UnitImage>(DOCUMENT_CONSTANTS.API.UPDATE_IMAGE(id), payload.file);
  },

  deleteDocument: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(DOCUMENT_CONSTANTS.API.DELETE_DOCUMENT(id));
  },

  deleteImage: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(DOCUMENT_CONSTANTS.API.DELETE_IMAGE(id));
  },

  buildFormData: (asset: PickedAsset, unit: number, renter?: number | null): FormData => {
    const formData = new FormData();
    formData.append('unit', String(unit));
    if (renter !== undefined && renter !== null) {
      formData.append('renter', String(renter));
    }

    const uri = asset.uri;
    const name = asset.name || `upload_${Date.now()}`;
    const mimeType = asset.mimeType || 'application/octet-stream';
    const type = asset.type === 'image' ? 'image' : 'document';

    if (type === 'image') {
      formData.append('image', {
        uri,
        name,
        type: mimeType,
      } as any);
    } else {
      formData.append('document', {
        uri,
        name,
        type: mimeType,
      } as any);
    }

    return formData;
  },
};
