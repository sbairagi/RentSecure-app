import { observabilityLogger } from './index';

export function logSubscriptionExpired(context?: Record<string, any>): void {
  observabilityLogger.trackSubscriptionFlow('expired', true, context);
}

export function logUpgradeFailure(error: Error, context?: Record<string, any>): void {
  observabilityLogger.trackSubscriptionFlow('upgrade_failed', false, { error: error.message, ...context });
}

export function logAddOnPurchaseFailure(error: Error, context?: Record<string, any>): void {
  observabilityLogger.trackSubscriptionFlow('addon_purchase_failed', false, { error: error.message, ...context });
}

export function logPaymentPending(context?: Record<string, any>): void {
  observabilityLogger.trackSubscriptionFlow('payment_pending', true, context);
}

export function logPaymentVerificationFailure(error: Error, context?: Record<string, any>): void {
  observabilityLogger.trackSubscriptionFlow('verification_failed', false, { error: error.message, ...context });
}
