export type AgreementStatus = 'draft' | 'pending_signature' | 'partially_signed' | 'fully_signed' | 'active' | 'expired' | 'terminated' | 'cancelled';

export type AgreementStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
};

export type AgreementListResponse =
  | Agreement[]
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: Agreement[];
    };

export interface Agreement {
  id: number;
  user: number | null;
  renter: number;
  unit: number;
  agreement_start_date: string;
  agreement_end_date: string;
  rent_amount: string;
  security_deposit: string;
  file: string | null;
  leegality_document_id: string | null;
  owner_signed: boolean;
  renter_signed: boolean;
  generated_at: string | null;
  notes: string;
  is_agreement_revoked: boolean;
  revocation_reason: string;
  revoked_by_owner: boolean;
  revoked_on: string | null;
  created_at: string;
  updated_at: string;
  renter_name?: string;
  renter_phone?: string;
  unit_name?: string;
  building_name?: string;
  status?: AgreementStatus;
}

export interface AgreementWithRelations extends Agreement {
  documents?: AgreementDocument[];
  timeline?: AgreementTimelineEntry[];
  witnesses?: AgreementWitness[];
  renter_details?: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  unit_details?: {
    id: number;
    unit: string;
    building_name: string;
    unit_type: string;
  };
}

export interface AgreementDocument {
  id: number;
  agreement: number;
  document: string;
  document_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface AgreementTimelineEntry {
  id: number;
  agreement: number;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  user_role: string;
  metadata?: Record<string, any>;
}

export interface AgreementWitness {
  id: number;
  agreement: number;
  name: string;
  phone: string;
  address: string;
  id_proof: string | null;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgreementSignature {
  id: number;
  agreement: number;
  signer_type: 'owner' | 'renter' | 'witness';
  signer_id: number | null;
  signer_name: string;
  signed_at: string | null;
  signature_url: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: 'pending' | 'signed' | 'declined';
  decline_reason: string | null;
}

export interface AgreementTemplate {
  id: number;
  name: string;
  description: string;
  template_file: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgreementFilters {
  search?: string;
  status?: AgreementStatus | '';
  building?: number | null;
  unit?: number | null;
  renter?: number | null;
  date_from?: string;
  date_to?: string;
  is_signed?: boolean;
  ordering?: string;
  page?: number;
}

export type SortOption = 'newest' | 'oldest' | 'start_date' | 'end_date' | 'status' | 'renter';

export interface AgreementCreatePayload {
  renter: number;
  unit: number;
  agreement_start_date: string;
  agreement_end_date: string;
  rent_amount: string;
  security_deposit?: string;
  notes?: string;
  witness_name?: string;
  witness_phone?: string;
  witness_address?: string;
}

export interface AgreementUpdatePayload extends Partial<AgreementCreatePayload> {
  owner_signed?: boolean;
  renter_signed?: boolean;
  leegality_document_id?: string;
  is_agreement_revoked?: boolean;
  revocation_reason?: string;
  revoked_by_owner?: boolean;
  revoked_on?: string | null;
}

export interface AgreementStatusSummary {
  draft: number;
  pending_signature: number;
  partially_signed: number;
  fully_signed: number;
  active: number;
  expired: number;
  terminated: number;
  cancelled: number;
  total: number;
}

export interface SubscriptionLimits {
  max_agreements: number | 'unlimited';
  max_document_uploads: number | 'unlimited';
  current_agreements: number;
  current_documents: number;
  can_create_agreement: boolean;
  can_edit_agreement?: boolean;
  can_delete_agreement?: boolean;
  can_sign_agreement?: boolean;
  can_generate_pdf?: boolean;
  can_upload_documents?: boolean;
  can_bulk_operations?: boolean;
  can_export?: boolean;
  can_analytics?: boolean;
}

export interface FeatureAccess {
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_sign: boolean;
  can_generate_pdf: boolean;
  can_upload_documents: boolean;
  can_bulk_operations: boolean;
  can_export: boolean;
  can_analytics: boolean;
  can_renew: boolean;
  can_terminate: boolean;
}

export interface BootstrapData {
  user: any;
  subscription: any;
  addOns: any[];
  featureLimits: any[];
  feature_access: FeatureAccess;
}

export interface SelectedFilters {
  search?: string;
  status?: string;
  building?: string;
  unit?: string;
  renter?: string;
  date_from?: string;
  date_to?: string;
}

export interface AgreementCardProps {
  agreement: Agreement;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSign?: () => void;
  onGeneratePDF?: () => void;
}

export interface AgreementStatusBadgeProps {
  status: AgreementStatus;
}

export interface AgreementFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: SelectedFilters;
  onApply: (filters: SelectedFilters) => void;
}

export interface AgreementTimelineItemProps {
  item: AgreementTimelineEntry;
}

export interface DocumentCardProps {
  document: AgreementDocument;
  onPreview: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export interface SignatureStatusCardProps {
  agreement: Agreement;
}

export interface WitnessCardProps {
  witness: AgreementWitness;
}

export interface AgreementSkeletonLoaderProps {
  type?: 'list' | 'detail';
}

export interface AgreementEmptyStateProps {
  onAction?: () => void;
}

export interface AgreementErrorStateProps {
  message: string;
  onRetry: () => void;
}
