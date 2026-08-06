import type { Document, DocumentFilters, DocumentListResponse, DocumentVersion, DocumentShareResponse, DocumentUsageLimits, FolderNode } from '../types/documents';

export const mockDocument: Document = {
  id: 1,
  owner: 1,
  parent: null,
  name: 'rent_agreement_unit_101.pdf',
  file: '/media/documents/2024/01/15/rent_agreement_unit_101.pdf',
  file_hash: 'a1b2c3d4e5f6',
  mime_type: 'application/pdf',
  size: 2048576,
  document_type: 'pdf',
  thumbnail: null,
  is_favorite: false,
  is_archived: false,
  is_shared: false,
  share_token: null,
  metadata: { uploaded_by: 'owner', source: 'mobile' },
  version: 1,
  previous_version: null,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

export const mockDocumentListResponse: DocumentListResponse = {
  results: [mockDocument],
};

export const mockDocumentVersion: DocumentVersion = {
  id: 1,
  document: 1,
  version: 1,
  file: '/media/documents/2024/01/15/rent_agreement_unit_101_v1.pdf',
  size: 2048576,
  mime_type: 'application/pdf',
  created_at: '2024-01-15T10:00:00Z',
  created_by: 'Owner User',
  change_summary: 'Initial upload',
};

export const mockDocumentShareResponse: DocumentShareResponse = {
  share_url: 'https://app.rentsecure.com/share/doc_abc123',
  share_token: 'doc_abc123',
  expires_at: null,
};

export const mockDocumentUsageLimits: DocumentUsageLimits = {
  max_documents: 100,
  max_document_size: 50 * 1024 * 1024,
  allowed_mime_types: ['application/pdf', 'image/jpeg', 'image/png'],
  current_documents: 12,
  can_upload: true,
  can_create_folder: true,
  can_share: true,
};

export const mockFolderNode: FolderNode = {
  id: 1,
  name: 'Property Documents',
  parent: null,
  children: [
    {
      id: 2,
      name: 'Rent Agreements',
      parent: 1,
      children: [],
      document_count: 5,
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
  document_count: 10,
  created_at: '2024-01-01T00:00:00Z',
};

export const mockFilters: DocumentFilters = {
  search: 'rent',
  type: 'pdf',
  parent: null,
  is_favorite: false,
  is_archived: false,
  date_from: '2024-01-01',
  date_to: '2024-12-31',
  ordering: '-created_at',
  page: 1,
};
