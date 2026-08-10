import type { UnitDocument, UnitImage, DocumentListResponse, PickedAsset } from '../../types/documents';

export const mockUnitDocument: UnitDocument = {
  id: 1,
  unit: 1,
  renter: null,
  document: '/media/unit_documents/2024/01/15/test.pdf',
  file_hash: 'a1b2c3d4e5f6',
  uploaded_at: '2024-01-15T10:00:00Z',
};

export const mockUnitImage: UnitImage = {
  id: 1,
  unit: 1,
  renter: null,
  image: '/media/unit_images/2024/01/15/test.jpg',
  image_hash: 'f6e5d4c3b2a1',
  uploaded_at: '2024-01-15T10:00:00Z',
};

export const mockDocumentListResponse: DocumentListResponse = {
  results: [mockUnitDocument],
  count: 1,
};

export const mockImageListResponse: DocumentListResponse = {
  results: [mockUnitImage],
  count: 1,
};

export const mockPickedAsset: PickedAsset = {
  uri: 'file:///tmp/test.pdf',
  name: 'test.pdf',
  mimeType: 'application/pdf',
  size: 1024 * 1024,
  type: 'document',
};

export const mockDocumentFilters = {
  unit: 1,
  renter: null as number | null,
  search: 'test',
  ordering: '-uploaded_at',
};
