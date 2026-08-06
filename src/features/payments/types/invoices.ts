import type { PaymentMethod, PaymentStatus } from '../types/payments';

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
export type InvoiceStatusConfig = {
  label: string;
  color: string;
  backgroundColor: string;
};

export interface Invoice {
  id: number;
  invoice_number: string;
  rent_record: number;
  renter: number;
  unit: number;
  amount: string;
  tax: string;
  discount: string;
  late_fee: string;
  total_amount: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  pdf_url: string | null;
  pdf_generated_at: string | null;
  sent_at: string | null;
  sent_by: string | null;
  sent_via: string[];
  is_paid: boolean;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  renter_name: string;
  unit_name: string;
  building_name: string;
  payment_reference: string | null;
  notes: string;
}

export interface InvoiceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invoice[];
}

export interface InvoiceSummary {
  total_invoices: number;
  draft_count: number;
  sent_count: number;
  paid_count: number;
  overdue_count: number;
  cancelled_count: number;
  total_amount: string;
  paid_amount: string;
  pending_amount: string;
}

export type { PaymentStatus } from '../types/payments';
