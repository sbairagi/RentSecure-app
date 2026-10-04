import { observabilityLogger } from './index';

export function logPaymentFlowStarted(context?: Record<string, any>): void {
  observabilityLogger.trackPaymentFlow('started', true, context);
}

export function logOrderCreationFailure(error: Error, context?: Record<string, any>): void {
  observabilityLogger.trackPaymentFlow('order_creation_failed', false, { error: error.message, ...context });
}

export function logCheckoutFailure(error: Error, context?: Record<string, any>): void {
  observabilityLogger.trackPaymentFlow('checkout_failed', false, { error: error.message, ...context });
}

export function logVerificationFailure(error: Error, context?: Record<string, any>): void {
  observabilityLogger.trackPaymentFlow('verification_failed', false, { error: error.message, ...context });
}

export function logPendingPayment(context?: Record<string, any>): void {
  observabilityLogger.trackPaymentFlow('pending', true, context);
}

export function logSuccessfulPayment(context?: Record<string, any>): void {
  observabilityLogger.trackPaymentFlow('success', true, context);
}
