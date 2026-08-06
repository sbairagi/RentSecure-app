import type { PayoutStatus, PayoutStatusConfig } from '../types/payments';

export interface Payout {
  id: number;
  payment: number;
  amount: string;
  status: PayoutStatus;
  transaction_id: string;
  reference: string;
  initiated_at: string;
  completed_at: string | null;
  failed_at: string | null;
  failure_reason: string | null;
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
  created_at: string;
  updated_at: string;
  renter_name: string;
  unit_name: string;
  building_name: string;
}

export interface PayoutListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payout[];
}

export interface PayoutSummary {
  total_payouts: number;
  total_amount: string;
  successful_count: number;
  pending_count: number;
  failed_count: number;
  success_rate: number;
}

export interface PayoutRetryPayload {
  reason?: string;
}
