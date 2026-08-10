export type RenterStatus = 'active' | 'notice_period' | 'revoked' | 'deactivated';

export interface RenterUnitSummary {
  id: number;
  unit: string;
  unit_type: string;
  building: number | null;
  address_line: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string | null;
  longitude: string | null;
}

export interface RenterBuildingSummary {
  id: number;
  name: string;
  address_line: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface RenterProfile {
  id: number;
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
  onboarding_status: string;
  kyc_status: string;
  unit: RenterUnitSummary;
  building: RenterBuildingSummary | null;
  id_proof_url: string | null;
  rent_agreement_url: string | null;
}

export interface RenterRentRecord {
  id: number;
  due_date: string;
  amount: string;
  late_fee: string;
  discount: string;
  payment_status: string;
  payment_method: string;
  paid_on: string | null;
  transaction_id: string;
  invoice_url: string;
  payment_link: string;
  notes: string;
  unit_name: string;
  building_name: string;
  created_at: string;
  updated_at: string;
}

export interface RenterRentRecordSummary {
  due_date: string;
  amount: string;
  late_fee: string;
  payment_status: string;
  invoice_url: string;
}

export interface RenterAgreement {
  id: number;
  renter: number;
  unit: number;
  unit_name: string;
  building_name: string;
  generated_at: string;
  file: string | null;
  leegality_document_id: string;
  owner_signed: boolean;
  renter_signed: boolean;
  document_url: string | null;
}

export interface RenterDocument {
  id: number;
  name: string;
  id_proof_url: string | null;
  rent_agreement_url: string | null;
}

export interface RenterExtraCharge {
  id: number;
  name: string;
  amount: string;
  due_date: string;
  status: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface RenterDashboard {
  profile: RenterProfile;
  current_rent: RenterRentRecord | null;
  recent_payments: RenterRentRecordSummary[];
  agreement: RenterAgreement | null;
  notifications_unread_count: number;
  extra_charges_count: number;
}

export interface RenterRentRecordsResponse {
  data: RenterRentRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RenterExtraChargesResponse {
  data: RenterExtraCharge[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}