// NO subscription payment APIs exist on backend yet.
// These types represent what the frontend expects when backend is ready.

export type PaymentStatus = 'created' | 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'refunded' | 'expired';

export interface SubscriptionPayment {
  id: number;
  user: number;
  subscription: number;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  billing_cycle: string;
  created_at: string;
  paid_at?: string;
}

export interface PaymentOrderResponse {
  order_id: string;
  amount: string;
  currency: string;
  key_id: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  status: string;
  payment: SubscriptionPayment;
}
