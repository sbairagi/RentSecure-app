export type RenterStatus = 'active' | 'notice_period' | 'revoked' | 'deactivated';

export interface Renter {
  id: number;
  owner: number;
  name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  status: RenterStatus;
  rent_amount: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
  renter_image: string | null;
  id_proof: string;
  rent_agreement: string;
  whatsapp_number: string;
  rent_due_date: string;
  late_payment_count: number;
  missed_rents: number;
  is_flagged: boolean;
  flagged_reason: string;
  is_agreement_revoked: boolean;
  revocation_reason: string;
  revoked_by_owner: boolean;
  revoked_on: string | null;
  vacated_on: string | null;
  status_changed_at: string | null;
  notice_start_date: string | null;
  rating: number | null;
  feedback: string | null;
  rated_at: string | null;
  final_invoice_path: string;
  onboarding_status: string;
  kyc_status: string;
  onboarding_token: string;
  onboarding_link_sent_at: string | null;
  unit: number;
  user: number | null;
  photo?: string | null;
  current_unit?: number | null;
  building_name?: string | null;
  unit_name?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  security_deposit?: string | null;
  is_verified?: boolean;
  is_archived?: boolean;
}

export interface RenterUnitSummary {
  id: number;
  unit: string;
  unit_type: string;
  building_name: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface RenterBuildingSummary {
  id: number;
  name: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface RenterWithRelations extends Renter {
  documents?: RenterDocument[];
  kyc_documents?: KycDocument[];
  payments?: RenterPayment[];
  agreements?: RenterAgreement[];
  timeline?: RenterTimelineEntry[];
  notes_list?: RenterNote[];
}

export interface RenterDocument {
  id: number;
  renter: number;
  document: string;
  file_hash: string;
  uploaded_at: string;
}

export interface KycDocument {
  id: number;
  renter: number;
  document_type: KycDocumentType;
  document_number: string;
  document: string;
  file_hash: string;
  is_verified: boolean;
  expiry_date: string | null;
  extracted_text: string | null;
  ocr_processed: boolean;
  ocr_processed_at: string | null;
  uploaded_at: string;
}

export type KycDocumentType =
  'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'other';

export interface RenterPayment {
  id: number;
  renter: number;
  rent_record: number | null;
  amount: string;
  payment_method: PaymentMethod;
  payment_date: string;
  due_date: string;
  status: PaymentStatus;
  transaction_id: string;
  notes: string;
  created_at: string;
}

export type PaymentMethod =
  'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'credit_card' | 'debit_card' | 'other';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';

export interface RenterAgreement {
  id: number;
  renter: number;
  unit: number;
  agreement_start_date: string;
  agreement_end_date: string;
  document: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RenterTimelineEntry {
  id: number;
  renter: number;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  title?: string;
  icon?: string;
}

export interface RenterNote {
  id: number;
  renter: number;
  content: string;
  author: string;
  note?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RenterActivity {
  id: number;
  renter: number;
  action: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface RenterProfile {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  rent_amount: string;
  start_date: string;
  end_date: string | null;
  status: RenterStatus;
  is_verified: boolean;
  notes: string;
  unit?: RenterUnitSummary | null;
  building?: RenterBuildingSummary | null;
}

export type RenterStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
};

export type RenterListResponse =
  | Renter[]
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: Renter[];
    };

export interface RenterCreatePayload {
  name: string;
  email?: string | null;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  rent_amount: string;
  start_date: string;
  end_date?: string | null;
  unit?: number | null;
  notes?: string;
}

export interface RenterUpdatePayload extends Partial<RenterCreatePayload> {
  status?: RenterStatus;
  is_archived?: boolean;
}

export interface RenterFilters {
  search?: string;
  status?: RenterStatus | '';
  building?: number | null;
  unit?: number | null;
  is_archived?: boolean;
  ordering?: string;
  page?: number;
}

export type SortOption = 'newest' | 'oldest' | 'name' | 'rent_amount' | 'status';

export interface RenterStatusSummary {
  active: number;
  notice_period: number;
  revoked: number;
  deactivated: number;
  total: number;
}

export interface RenterBulkNotifyPayload {
  renter_ids: number[];
  message: string;
  notification_type: string;
}

export interface RenterAssignUnitPayload {
  unit_id: number;
}

export interface RenterTransferUnitPayload {
  new_unit_id: number;
}

export interface SubscriptionLimits {
  max_renters: number | 'unlimited';
  max_document_uploads: number | 'unlimited';
  max_kyc_documents: number | 'unlimited';
  current_renters: number;
  current_documents: number;
  current_kyc_documents: number;
  can_create_renter: boolean;
  can_edit_renter?: boolean;
  can_delete_renter?: boolean;
  can_upload_documents?: boolean;
  can_bulk_operations?: boolean;
  can_export?: boolean;
  can_import?: boolean;
  can_analytics?: boolean;
}

export interface FeatureAccess {
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_upload_documents: boolean;
  can_bulk_operations: boolean;
  can_export: boolean;
  can_import: boolean;
  can_analytics: boolean;
}

export interface Unit {
  id: number;
  owner: number;
  building: number | null;
  unit: string;
  building_name: string;
  unit_type: string;
  address_line: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string | null;
  longitude: string | null;
  status: string;
  is_vacant: boolean;
  is_verified: boolean;
  is_archived: boolean;
  last_vacated_at: string | null;
  rent_due_reminder: boolean;
  agreement_expiry_reminder: boolean;
  maintenance_notes: string;
  notes: string;
  created_at: string;
  updated_at: string;
  current_renter?: RenterSummary | null;
}

export interface RenterSummary {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: RenterStatus;
  rent_amount: string;
  start_date: string;
  end_date: string | null;
}

export interface Building {
  id: number;
  owner: number;
  name: string;
  address_line: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RentRecord {
  id: number;
  renter: number;
  unit: number;
  amount: string;
  payment_method: string;
  status: string;
  paid_on: string | null;
  due_date: string;
  late_fee: string;
  discount: string;
  notes: string;
  transaction_id: string;
  payout_status: string;
  payout_reference: string;
  payment_link: string;
  invoice_pdf: string | null;
  razorpay_order_id: string;
  payout_retries: number;
  last_payout_retry: string | null;
  payout_retry_count: number;
  adjustment_reason: string;
  created_at: string;
  updated_at: string;
}

export interface ExtraCharge {
  id: number;
  renter: number;
  unit: number;
  name: string;
  charge_type?: string;
  amount: string;
  description?: string;
  due_date: string;
  status: string;
  is_paid?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PoliceVerification {
  id: number;
  renter: number;
  unit: number;
  verification_status: string;
  verification_date: string | null;
  police_station: string;
  document: string | null;
  file?: string | null;
  notes: string;
  status?: string;
  submitted_at?: string | null;
  verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RentAgreement {
  id: number;
  renter: number;
  unit: number;
  agreement_start_date: string;
  agreement_end_date: string;
  document: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export interface BootstrapData {
  user: any;
  subscription: any;
  feature_access: FeatureAccess;
  usage_limits: SubscriptionLimits;
}
