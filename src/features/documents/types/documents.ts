export type DocumentType =
  | 'image'
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'excel'
  | 'csv'
  | 'zip'
  | 'text'
  | 'audio'
  | 'video';

export type DocumentVisibility = 'private' | 'shared' | 'public';

export type DocumentStatus = 'active' | 'archived' | 'deleted';

export type DocumentSortField = 'name' | 'created_at' | 'size' | 'type' | 'favorite';

export type DocumentListResponse =
  | Document[]
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: Document[];
    };

export interface Document {
  id: number;
  owner: number;
  parent: number | null;
  name: string;
  file: string | null;
  file_hash: string;
  mime_type: string;
  size: number;
  document_type: DocumentType;
  thumbnail: string | null;
  is_favorite: boolean;
  is_archived: boolean;
  is_shared: boolean;
  share_token: string | null;
  metadata: Record<string, any>;
  version: number;
  previous_version: number | null;
  created_at: string;
  updated_at: string;
  children?: Document[];
  versions?: DocumentVersion[];
}

export interface DocumentVersion {
  id: number;
  document: number;
  version: number;
  file: string;
  size: number;
  mime_type: string;
  created_at: string;
  created_by: string;
  change_summary: string;
}

export interface DocumentFilters {
  search?: string;
  type?: DocumentType | '';
  parent?: number | null;
  is_favorite?: boolean;
  is_archived?: boolean;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
}

export interface DocumentCreatePayload {
  parent?: number | null;
  name: string;
  file: FormData;
  metadata?: Record<string, any>;
}

export interface DocumentUpdatePayload {
  name?: string;
  parent?: number | null;
  is_favorite?: boolean;
  is_archived?: boolean;
  metadata?: Record<string, any>;
}

export interface DocumentSharePayload {
  visibility: DocumentVisibility;
  expires_in?: number;
}

export interface DocumentShareResponse {
  share_url: string;
  share_token: string;
  expires_at: string | null;
}

export interface DocumentUploadProgress {
  loaded: number;
  total: number;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface DocumentUsageLimits {
  max_documents: number | 'unlimited';
  max_document_size: number | 'unlimited';
  allowed_mime_types: string[];
  current_documents: number;
  can_upload: boolean;
  can_create_folder: boolean;
  can_share: boolean;
}

export interface FolderNode {
  id: number;
  name: string;
  parent: number | null;
  children: FolderNode[];
  document_count: number;
  created_at: string;
}

export interface MetadataField {
  key: string;
  label: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
}

export type SortOption = {
  label: string;
  value: DocumentSortField;
  direction: 'asc' | 'desc';
};
