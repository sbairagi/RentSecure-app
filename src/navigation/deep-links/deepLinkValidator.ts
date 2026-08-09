import type { DeepLinkPayload, DeepLinkType } from '@/navigation/types';
import { DEEP_LINK_CONFIG } from './deepLinkConfig';

export interface DeepLinkValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedPayload?: DeepLinkPayload;
}

export function validateDeepLink(
  payload: DeepLinkPayload,
  userRole?: string | null
): DeepLinkValidationResult {
  if (!payload.type) {
    return { isValid: false, error: 'Missing resource type' };
  }

  if ((payload.type === 'building' || payload.type === 'unit' || payload.type === 'renter' ||
       payload.type === 'caretaker' || payload.type === 'rent_record' || payload.type === 'maintenance' ||
       payload.type === 'visitor' || payload.type === 'agreement' || payload.type === 'document' ||
       payload.type === 'notification') && !payload.id) {
    return { isValid: false, error: 'Missing resource ID' };
  }

  if ((payload.type === 'payment' || payload.type === 'invitation') && !payload.token) {
    return { isValid: false, error: 'Missing token' };
  }

  if (payload.id && !isValidResourceId(payload.id)) {
    return { isValid: false, error: 'Invalid resource ID format' };
  }

  return { isValid: true };
}

function isValidResourceId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 64;
}

export function sanitizeDeepLinkPayload(payload: DeepLinkPayload): DeepLinkPayload {
  const sanitized: DeepLinkPayload = { ...payload };

  if (sanitized.token) {
    sanitized.token = sanitized.token.replace(/[\n\r\t]/g, '').trim();
  }
  if (sanitized.id) {
    sanitized.id = sanitized.id.replace(/[^a-zA-Z0-9_-]/g, '').trim();
  }
  if (sanitized.action) {
    sanitized.action = sanitized.action.replace(/[^a-zA-Z0-9_-]/g, '').trim();
  }

  delete sanitized.redirect;
  delete sanitized.url;
  delete sanitized.link;
  delete sanitized.href;

  return sanitized;
}

export function getDeepLinkSecurityWarnings(payload: DeepLinkPayload): string[] {
  const warnings: string[] = [];

  if (payload.id && payload.id.length > 64) {
    warnings.push('Resource ID exceeds maximum length');
  }
  if (payload.token && payload.token.length > 128) {
    warnings.push('Token exceeds maximum length');
  }
  if (payload.token && /[<>"']/.test(payload.token)) {
    warnings.push('Token contains suspicious characters');
  }

  return warnings;
}
