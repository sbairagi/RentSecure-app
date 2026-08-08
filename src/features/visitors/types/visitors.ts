export type VisitorStatus =
  | "requested"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "checked_in"
  | "checked_out"
  | "expired"
  | "cancelled"
  | "blocked";

export type VisitorPurpose =
  | "personal_visit"
  | "family_visit"
  | "business_meeting"
  | "service_personnel"
  | "maintenance"
  | "delivery"
  | "emergency"
  | "other";

export type VisitorHistoryAction =
  | "created"
  | "approved"
  | "rejected"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "blocked"
  | "expired"
  | "qr_generated"
  | "qr_verified"
  | "otp_generated"
  | "otp_verified";

export interface Visitor {
  id: number;
  visitor_name: string;
  phone_number: string;
  email: string;
  photo: string | null;
  photo_url: string | null;
  purpose: VisitorPurpose;
  building: number;
  building_name: string;
  unit: number;
  unit_identifier: string;
  renter: number;
  renter_name: string;
  renter_phone: string;
  visit_date: string;
  expected_arrival: string;
  expected_departure: string;
  number_of_visitors: number;
  vehicle_number: string;
  notes: string;
  status: VisitorStatus;
  approved_by: number | null;
  approved_by_name: string | null;
  approved_at: string | null;
  rejection_reason: string;
  approver_phone: string;
  approver_notes: string;
  qr_token: string | null;
  qr_generated_at: string | null;
  qr_expires_at: string | null;
  qr_max_uses: number;
  qr_used_count: number;
  qr_verified: boolean;
  qr_verified_at: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  verified_by: number | null;
  verified_by_name: string | null;
  verified_by_phone: string;
  vehicle_details: string;
  visit_duration_minutes: number | null;
  otp_code: string;
  otp_generated_at: string | null;
  otp_expires_at: string | null;
  otp_verified: boolean;
  otp_verified_at: string | null;
  otp_attempts: number;
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  can_check_in: boolean;
  can_check_out: boolean;
  is_completed: boolean;
  is_otp_expired: boolean;
  is_qr_expired: boolean;
}

export interface VisitorCreatePayload {
  visitor_name: string;
  phone_number: string;
  email?: string;
  photo?: string | null;
  purpose: VisitorPurpose;
  building: number;
  unit: number;
  renter: number;
  visit_date: string;
  expected_arrival: string;
  expected_departure: string;
  number_of_visitors?: number;
  vehicle_number?: string;
  notes?: string;
}

export interface VisitorUpdatePayload extends Partial<VisitorCreatePayload> {
  status?: VisitorStatus;
  rejection_reason?: string;
  approver_notes?: string;
}

export interface VisitorListResponse {
  count?: number;
  next: string | null;
  previous: string | null;
  results: Visitor[];
}

export type VisitorDetailResponse = Visitor;

export interface VisitorFilters {
  search?: string;
  status?: VisitorStatus;
  building?: number;
  unit?: number;
  renter?: number;
  visit_date?: string;
  ordering?: string;
  page?: number;
}

export type VisitorFilterFormData = VisitorFilters;

export interface VisitorApprovalPayload {
  action: "approve" | "reject";
  reason?: string;
  notes?: string;
}

export interface VisitorCheckInPayload {
  vehicle_details?: string;
  qr_token?: string;
  otp_code?: string;
}

export interface VisitorQRGenerateResponse {
  message: string;
  qr_token: string;
  qr_generated_at: string | null;
  qr_expires_at: string | null;
  qr_max_uses: number;
}

export interface VisitorOTPGenerateResponse {
  message: string;
  otp_expires_at: string | null;
  otp_attempts_remaining: number;
}

export interface VisitorStatsResponse {
  total: number;
  pending_approval: number;
  approved: number;
  checked_in: number;
  checked_out: number;
  rejected: number;
  expired: number;
  cancelled: number;
  blocked: number;
  today: number;
  this_week: number;
}

export interface VisitorHistoryEntry {
  id: number;
  visitor: number;
  action: VisitorHistoryAction;
  action_display: string;
  description: string;
  performed_by: number | null;
  performed_by_name: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface VisitorQRVerifyResponse {
  message: string;
  visitor_name: string;
  unit: string;
  purpose: string;
  status: VisitorStatus;
}

export interface QRVerificationResult {
  isValid: boolean;
  visitor: Visitor | null;
  error?: string;
}

export interface OTPVerificationResult {
  success: boolean;
  error?: string;
  attempts_remaining?: number;
}

export interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  onResend?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  expirySeconds?: number;
  maxAttempts?: number;
  attemptsRemaining?: number;
}

export interface QRDisplayProps {
  visible: boolean;
  visitor: Visitor | null;
  onClose: () => void;
  onVerify?: () => void;
}
