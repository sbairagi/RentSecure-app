import { documentsApi } from '../services/documentsApi';
import type {
  Document,
  DocumentCreatePayload,
  DocumentFilters,
  DocumentListResponse,
  DocumentShareResponse,
  DocumentUpdatePayload,
  DocumentUsageLimits,
  DocumentVersion,
  FolderNode,
  SortOption,
} from '../types';

export const documentsRepository = {
  fetchDocuments: async (params?: DocumentFilters): Promise<DocumentListResponse> => {
    return documentsApi.list(params);
  },

  fetchDocument: async (id: number | string): Promise<Document> => {
    return documentsApi.retrieve(id);
  },

  createDocument: async (data: DocumentCreatePayload): Promise<Document> => {
    return documentsApi.create(data);
  },

  updateDocument: async (
    id: number | string,
    data: DocumentUpdatePayload
  ): Promise<Document> => {
    return documentsApi.update(id, data);
  },

  deleteDocument: async (id: number | string): Promise<void> => {
    return documentsApi.remove(id);
  },

  uploadDocument: async (
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<Document> => {
    return documentsApi.upload(formData, onProgress);
  },

  downloadDocument: async (id: number | string): Promise<Blob> => {
    return documentsApi.download(id);
  },

  previewDocument: async (id: number | string): Promise<{ url: string }> => {
    return documentsApi.preview(id);
  },

  moveDocument: async (id: number | string, parentId: number | null): Promise<Document> => {
    return documentsApi.move(id, parentId);
  },

  copyDocument: async (id: number | string, parentId: number | null): Promise<Document> => {
    return documentsApi.copy(id, parentId);
  },

  shareDocument: async (
    id: number | string,
    visibility: 'private' | 'shared' | 'public',
    expires_in?: number
  ): Promise<DocumentShareResponse> => {
    return documentsApi.share(id, { visibility, expires_in });
  },

  toggleFavorite: async (id: number | string): Promise<Document> => {
    return documentsApi.toggleFavorite(id);
  },

  archiveDocument: async (id: number | string): Promise<Document> => {
    return documentsApi.archive(id);
  },

  restoreDocument: async (id: number | string): Promise<Document> => {
    return documentsApi.restore(id);
  },

  getVersions: async (id: number | string): Promise<DocumentVersion[]> => {
    return documentsApi.getVersions(id);
  },

  getDuplicates: async (): Promise<Document[]> => {
    return documentsApi.getDuplicates();
  },

  getFolders: async (): Promise<FolderNode[]> => {
    return documentsApi.getFolders();
  },

  getUsageLimits: async (): Promise<DocumentUsageLimits> => {
    return documentsApi.getUsageLimits();
  },

  bulkDelete: async (ids: (number | string)[]): Promise<void> => {
    return documentsApi.bulkDelete(ids);
  },

  bulkMove: async (ids: (number | string)[], parentId: number | null): Promise<void> => {
    return documentsApi.bulkMove(ids, parentId);
  },

  bulkDownload: async (ids: (number | string)[]): Promise<Blob> => {
    return documentsApi.bulkDownload(ids);
  },

  search: async (query: string): Promise<Document[]> => {
    return documentsApi.search(query);
  },

  updateMetadata: async (id: number | string, metadata: Record<string, any>): Promise<Document> => {
    return documentsApi.updateMetadata(id, metadata);
  },
};
