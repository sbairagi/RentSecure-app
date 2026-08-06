export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded' | 'failed' | 'partially_paid' | 'processing';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'credit_card' | 'debit_card' | 'other';
export type PaymentSortOption = 'newest' | 'oldest' | 'amount_high' | 'amount_low' | 'due_date' | 'status';
export type PaymentStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
  icon: string;
};
export type PaymentMethodConfig = {
  label: string;
  icon: string;
  color: string;
};
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'retrying';
export type PayoutStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
};

export interface Payment {
  id: number;
  renter: number;
  rent_record: number | null;
  amount: string;
  payment_method: PaymentMethod;
  payment_date: string;
  due_date: string;
  status: PaymentStatus;
  transaction_id: string;
  razorpay_order_id: string;
  payment_link: string;
  invoice_pdf: string | null;
  invoice_number: string;
  invoice_status: string;
  receipt_url: string | null;
  qr_code: string | null;
  late_fee: string;
  tax: string;
  discount: string;
  total_amount: string;
  retry_count: number;
  max_retries: number;
  remarks: string;
  payout_status: string;
  payout_reference: string;
  reminder_status: {
    whatsapp: string;
    email: string;
    sms: string;
    push: string;
  };
  renter_name: string;
  unit_name: string;
  building_name: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentFilters {
  search?: string;
  status?: PaymentStatus | '';
  payment_method?: PaymentMethod | '';
  renter?: number | null;
  unit?: number | null;
  building?: number | null;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PaymentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}

export interface PaymentSummary {
  total_collected: number;
  total_pending: number;
  total_overdue: number;
  total_failed: number;
  total_refunded: number;
  pending_count: number;
  overdue_count: number;
  failed_count: number;
  paid_count: number;
  collection_rate: number;
  late_payment_rate: number;
}

export interface PaymentAnalytics {
  monthly_collection: MonthlyCollectionItem[];
  collection_trend: CollectionTrendItem[];
  payment_success_rate: number;
  late_payment_rate: number;
  outstanding_amount: number;
  total_payments: number;
  average_payment_amount: string;
  top_payment_methods: { method: PaymentMethod; count: number; amount: string }[];
  payment_by_status: { status: PaymentStatus; count: number; amount: string }[];
}

export interface MonthlyCollectionItem {
  month: string;
  amount: string;
  count: number;
}

export interface CollectionTrendItem {
  date: string;
  amount: string;
  count: number;
}

export interface PaymentTimelineEntry {
  id: number;
  payment: number;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  user_role: string;
  metadata?: Record<string, any>;
}

export interface PaymentLink {
  id: number;
  payment: number;
  url: string;
  qr_code: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface RetryPaymentPayload {
  reason?: string;
  notify_renter?: boolean;
}

export interface CollectRentPayload {
  amount: string;
  payment_method: PaymentMethod;
  late_fee?: string;
  discount?: string;
  tax?: string;
  transaction_id?: string;
  remarks?: string;
  payment_date?: string;
}

export interface RefundPayload {
  amount: string;
  reason: string;
  notify_renter?: boolean;
}

export interface GenerateInvoicePayload {
  rent_record_ids: number[];
  invoice_date?: string;
  due_date?: string;
  notes?: string;
}

export interface ExportPaymentsPayload {
  format: 'csv' | 'xlsx' | 'pdf';
  payment_ids?: number[];
  filters?: PaymentFilters;
}

export interface PaymentFeatureAccess {
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_initiate_payment?: boolean;
  can_verify_payment?: boolean;
  can_refund_payment?: boolean;
  can_retry_payment?: boolean;
  can_cancel_payment?: boolean;
  can_generate_invoice?: boolean;
  can_send_reminder?: boolean;
  can_view_analytics?: boolean;
  can_export_payments?: boolean;
  can_bulk_actions?: boolean;
}

export type PaymentExportFormat = 'csv' | 'xlsx' | 'pdf';
