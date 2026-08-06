import { apiService } from '@/services/api/apiClient';
import { API_CONFIG } from '@/services/api/endpoints';
import { DOCUMENT_CONSTANTS } from '../constants/documents';
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

export const documentsApi = {
  list: async (params?: DocumentFilters): Promise<DocumentListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.parent !== undefined && params?.parent !== null)
      searchParams.set('parent', String(params.parent));
    if (params?.is_favorite !== undefined)
      searchParams.set('is_favorite', String(params.is_favorite));
    if (params?.is_archived !== undefined)
      searchParams.set('is_archived', String(params.is_archived));
    if (params?.date_from) searchParams.set('date_from', params.date_from);
    if (params?.date_to) searchParams.set('date_to', params.date_to);
    if (params?.ordering) searchParams.set('ordering', params.ordering);
    if (params?.page) searchParams.set('page', String(params.page));
    const query = searchParams.toString();
    return apiService.get<DocumentListResponse>(
      `${DOCUMENT_CONSTANTS.API.LIST}${query ? `?${query}` : ''}`
    );
  },

  retrieve: async (id: number | string): Promise<Document> => {
    return apiService.get<Document>(DOCUMENT_CONSTANTS.API.DETAIL(id));
  },

  create: async (data: DocumentCreatePayload): Promise<Document> => {
    return apiService.post<Document>(DOCUMENT_CONSTANTS.API.CREATE, data);
  },

  update: async (
    id: number | string,
    data: DocumentUpdatePayload
  ): Promise<Document> => {
    return apiService.patch<Document>(DOCUMENT_CONSTANTS.API.UPDATE(id), data);
  },

  remove: async (id: number | string): Promise<void> => {
    return apiService.delete<void>(DOCUMENT_CONSTANTS.API.DELETE(id));
  },

  upload: async (
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<Document> => {
    return apiService.upload<Document>(
      DOCUMENT_CONSTANTS.API.UPLOAD,
      formData,
      onProgress
    );
  },

  download: async (id: number | string): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(DOCUMENT_CONSTANTS.API.DOWNLOAD(id), {
      headers: {
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : '',
      },
    });
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  },

  preview: async (id: number | string): Promise<{ url: string }> => {
    return apiService.get<{ url: string }>(DOCUMENT_CONSTANTS.API.PREVIEW(id));
  },

  move: async (id: number | string, parentId: number | null): Promise<Document> => {
    return apiService.post<Document>(DOCUMENT_CONSTANTS.API.MOVE(id), { parent: parentId });
  },

  copy: async (id: number | string, parentId: number | null): Promise<Document> => {
    return apiService.post<Document>(DOCUMENT_CONSTANTS.API.COPY(id), { parent: parentId });
  },

  share: async (
    id: number | string,
    payload: { visibility: 'private' | 'shared' | 'public'; expires_in?: number }
  ): Promise<DocumentShareResponse> => {
    return apiService.post<DocumentShareResponse>(
      DOCUMENT_CONSTANTS.API.SHARE(id),
      payload
    );
  },

  toggleFavorite: async (id: number | string): Promise<Document> => {
    return apiService.post<Document>(DOCUMENT_CONSTANTS.API.FAVORITE(id), {});
  },

  archive: async (id: number | string): Promise<Document> => {
    return apiService.post<Document>(DOCUMENT_CONSTANTS.API.ARCHIVE(id), {});
  },

  restore: async (id: number | string): Promise<Document> => {
    return apiService.post<Document>(DOCUMENT_CONSTANTS.API.RESTORE(id), {});
  },

  getVersions: async (id: number | string): Promise<DocumentVersion[]> => {
    return apiService.get<DocumentVersion[]>(DOCUMENT_CONSTANTS.API.VERSIONS(id));
  },

  getDuplicates: async (): Promise<Document[]> => {
    return apiService.get<Document[]>(DOCUMENT_CONSTANTS.API.DUPLICATES);
  },

  getFolders: async (): Promise<FolderNode[]> => {
    return apiService.get<FolderNode[]>(DOCUMENT_CONSTANTS.API.FOLDERS);
  },

  getUsageLimits: async (): Promise<DocumentUsageLimits> => {
    return apiService.get<DocumentUsageLimits>(DOCUMENT_CONSTANTS.API.USAGE_LIMITS);
  },

  bulkDelete: async (ids: (number | string)[]): Promise<void> => {
    return apiService.post<void>(DOCUMENT_CONSTANTS.API.BULK_DELETE, { ids });
  },

  bulkMove: async (ids: (number | string)[], parentId: number | null): Promise<void> => {
    return apiService.post<void>(DOCUMENT_CONSTANTS.API.BULK_MOVE, { ids, parent: parentId });
  },

  bulkDownload: async (ids: (number | string)[]): Promise<Blob> => {
    const token = await getAuthToken();
    const response = await fetch(DOCUMENT_CONSTANTS.API.BULK_DOWNLOAD, {
      method: 'POST',
      headers: {
        Authorization: token ? `${API_CONFIG.BEARER_PREFIX}${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) throw new Error('Bulk download failed');
    return response.blob();
  },

  search: async (query: string): Promise<Document[]> => {
    return apiService.get<Document[]>(`${DOCUMENT_CONSTANTS.API.SEARCH}?q=${encodeURIComponent(query)}`);
  },

  updateMetadata: async (
    id: number | string,
    metadata: Record<string, any>
  ): Promise<Document> => {
    return apiService.patch<Document>(DOCUMENT_CONSTANTS.API.METADATA(id), { metadata });
  },
};

async function getAuthToken(): Promise<string | null> {
  try {
    const { MMKV } = await import('react-native-mmkv');
    const mmkv = new MMKV();
    return mmkv.getString('access_token') ?? null;
  } catch {
    return null;
  }
}
