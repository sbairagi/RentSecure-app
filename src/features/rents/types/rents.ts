export type RentPaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type RentPaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'card' | 'online' | 'other';
export type RentPayoutStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type RentSortOption = 'newest' | 'oldest' | 'amount_high' | 'amount_low' | 'due_date' | 'status';

export type RentStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
  icon: string;
};

export type RentMethodConfig = {
  label: string;
  icon: string;
  color: string;
};

export type RentPayoutStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
};

export interface RentRecord {
  id: number;
  unit: number;
  renter: number | null;
  amount: string;
  payment_method: RentPaymentMethod;
  status: RentPaymentStatus;
  paid_on: string | null;
  due_date: string;
  late_fee: string;
  discount: string;
  notes: string;
  transaction_id: string;
  payout_status: RentPayoutStatus;
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
  renter_name?: string;
  unit_name?: string;
  building_name?: string;
  building_id?: number;
}

export interface RentRecordCreatePayload {
  unit: number;
  renter?: number | null;
  amount: string;
  payment_method: RentPaymentMethod;
  due_date: string;
  late_fee?: string;
  discount?: string;
  notes?: string;
  adjustment_reason?: string;
}

export interface RentRecordUpdatePayload {
  notes?: string;
  adjustment_reason?: string;
  late_fee?: string;
  discount?: string;
}

export interface RentFilters {
  search?: string;
  status?: RentPaymentStatus | '';
  payment_method?: RentPaymentMethod | '';
  renter?: number | null;
  unit?: number | null;
  building?: number | null;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface RentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RentRecord[];
}

export interface RentSummary {
  month: string;
  collected_amount: string;
  collected_count: number;
  pending_count: number;
}

export interface RentOverviewItem {
  tenant: string;
  unit: string;
  building: string | null;
  amount: string;
  month: string;
  year: number;
  status: RentPaymentStatus;
  payout: RentPayoutStatus;
  invoice_url: string | null;
}

export interface RenterDueRent {
  amount: string;
  month: number;
  year: number;
  property: string;
  building: string | null;
  payment_link: string;
  due_date: string;
}

export interface RenterRentHistoryItem {
  month: number;
  year: number;
  amount: string;
  status: RentPaymentStatus;
  invoice_url: string | null;
  payment_link: string;
}

export interface CreateRentPaymentPayload {
  rent_id: number;
}

export interface CreateRentPaymentResponse {
  order_id: string;
  amount: string;
  currency: string;
  key_id: string;
  rent_id: number;
}

export interface VerifyRentPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyRentPaymentResponse {
  status: string;
  message: string;
  rent_id: number;
  payment_status: RentPaymentStatus;
  paid_on?: string;
}

export interface RetryPayoutResponse {
  message: string;
  status: RentPayoutStatus;
}
