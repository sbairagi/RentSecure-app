import type { OperationCategory } from '../types';
import { isSensitiveFinancial } from '../utils/classification';

const FINANCIAL_RESOURCES = [
  'payments',
  'rent-records',
  'rent_records',
  'invoices',
  'subscriptions',
  'payouts',
  'refunds',
  'add-ons',
  'bank-details',
  'bank_details',
];

const FINANCIAL_ENDPOINTS = [
  '/payments/',
  '/rent-records/',
  '/invoices/',
  '/subscriptions/',
  '/payments/initiate/',
  '/payments/verify/',
  '/payments/refund/',
  '/add-ons/',
  '/owner/update-bank-details/',
  '/owner/retry_payout_api/',
  '/rent-records/generate/',
];

export function isFinancialResource(resource: string): boolean {
  const normalized = resource.toLowerCase();
  return FINANCIAL_RESOURCES.some((r) => normalized.includes(r));
}

export function isFinancialEndpoint(endpoint: string): boolean {
  const normalized = endpoint.toLowerCase();
  return FINANCIAL_ENDPOINTS.some((e) => normalized.includes(e));
}

export function isFinancialCategory(category: OperationCategory): boolean {
  return isSensitiveFinancial(category);
}

export function requiresOnlineConfirmation(category: OperationCategory): boolean {
  return isSensitiveFinancial(category) || category === 'online-only';
}

export function getFinancialDisclaimer(): string {
  return 'Financial information shown may be outdated. Please verify with the server for accurate payment status.';
}

export function getPaymentStatusDisclaimer(): string {
  return 'Payment status is not confirmed until verified by the server. Do not rely on locally cached status for payment confirmation.';
}

export function sanitizeFinancialData(data: Record<string, any>): Record<string, any> {
  const sensitiveFields = ['card_number', 'cvv', 'pin', 'password', 'token', 'secret'];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

export function validateFinancialOperation(
  category: OperationCategory,
  isOnline: boolean
): { allowed: boolean; reason?: string } {
  if (isFinancialCategory(category)) {
    if (!isOnline) {
      return {
        allowed: false,
        reason: 'Financial operations require an internet connection. Please try again when online.',
      };
    }
    return {
      allowed: true,
      reason: undefined,
    };
  }

  if (category === 'online-only' && !isOnline) {
    return {
      allowed: false,
      reason: 'This operation requires an internet connection.',
    };
  }

  return { allowed: true };
}
