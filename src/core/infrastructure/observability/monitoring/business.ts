import { observabilityLogger } from '../logging';
import type { BusinessErrorEvent } from '../types';

const BUSINESS_FLOW_TRACKERS: Record<string, (step: string, success: boolean, context?: Record<string, any>) => void> = {
  login: (step, success, context) => observabilityLogger.trackAuthFlow(step, success, context),
  registration: (step, success, context) => observabilityLogger.trackAuthFlow(step, success, context),
  payment: (step, success, context) => observabilityLogger.trackPaymentFlow(step, success, context),
  subscription: (step, success, context) => observabilityLogger.trackSubscriptionFlow(step, success, context),
  rent_payment: (step, success, context) => observabilityLogger.trackPaymentFlow(step, success, context),
  maintenance: (step, success, context) => observabilityLogger.trackBusinessFlow('maintenance', step, success, context),
  visitor_verification: (step, success, context) =>
    observabilityLogger.trackBusinessFlow('visitor_verification', step, success, context),
  document_upload: (step, success, context) => observabilityLogger.trackUploadFlow(step, success, context),
  notification: (step, success, context) => observabilityLogger.trackNotificationFlow(step, success, context),
  ai_tool: (step, success, context) => observabilityLogger.trackAiFlow(step, success, context),
  search: (step, success, context) => observabilityLogger.trackSearchFlow(step, success, context),
};

export function trackBusinessFlow(flow: string, step: string, success: boolean, context?: Record<string, any>): void {
  const tracker = BUSINESS_FLOW_TRACKERS[flow];
  if (tracker) {
    tracker(step, success, context);
  } else {
    observabilityLogger.trackBusinessFlow(flow, step, success, context);
  }
}

export const BUSINESS_FLOW_STEPS = {
  login: ['started', 'otp_sent', 'otp_verified', 'profile_loaded', 'completed', 'failed'],
  registration: ['started', 'otp_sent', 'profile_created', 'completed', 'failed'],
  payment: ['started', 'order_created', 'checkout_opened', 'payment_initiated', 'verified', 'completed', 'failed'],
  subscription: ['started', 'plan_selected', 'payment_initiated', 'completed', 'failed'],
  rent_payment: ['started', 'order_created', 'payment_initiated', 'verified', 'completed', 'failed'],
  maintenance: ['started', 'submitted', 'assigned', 'resolved', 'failed'],
  visitor_verification: ['started', 'otp_sent', 'verified', 'approved', 'rejected', 'failed'],
  document_upload: ['started', 'uploading', 'completed', 'failed'],
  notification: ['started', 'sent', 'delivered', 'failed'],
  ai_tool: ['started', 'processing', 'completed', 'failed'],
  search: ['started', 'query_sent', 'results_received', 'completed', 'failed'],
} as const;
