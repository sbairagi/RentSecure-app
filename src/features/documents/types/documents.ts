export type UnitDocumentType = 'pdf' | 'image' | 'doc' | 'docx' | 'excel' | 'csv' | 'text' | 'zip' | 'audio' | 'video' | 'other';

export interface UnitDocument {
  id: number;
  unit: number;
  renter: number | null;
  document: string;
  file_hash: string;
  uploaded_at: string;
}

export interface UnitImage {
  id: number;
  unit: number;
  renter: number | null;
  image: string;
  image_hash: string;
  uploaded_at: string;
}

export interface DocumentUploadPayload {
  unit: number;
  renter?: number | null;
  file: FormData;
}

export interface DocumentUploadProgress {
  loaded: number;
  total: number;
  progress: number;
  status: 'preparing' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface DocumentListResponse {
  results: (UnitDocument | UnitImage)[];
  count?: number;
}

export interface DocumentFilters {
  unit?: number;
  renter?: number | null;
  search?: string;
  ordering?: string;
}

export interface MetadataField {
  key: string;
  label: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
}

export type PickedAsset = {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
  type?: 'image' | 'document';
};
