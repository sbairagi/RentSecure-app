import { SECURITY_CONSTANTS } from '../constants';
import type { DeepLinkValidationResult, UrlValidationResult } from '../types';

export class DeepLinkValidator {
  static validatePayload(payload: Record<string, any>): DeepLinkValidationResult {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, error: 'Invalid deep link payload' };
    }

    const allowedTypes = [
      'payment',
      'invitation',
      'agreement',
      'rent_record',
      'notification',
      'building',
      'unit',
      'renter',
      'caretaker',
      'maintenance',
      'visitor',
      'document',
      'subscription',
      'general',
    ];

    const type = payload.type;
    if (!type || !allowedTypes.includes(type)) {
      return { isValid: false, error: `Invalid deep link type: ${type}` };
    }

    if (payload.token) {
      if (typeof payload.token !== 'string' || payload.token.length < 10) {
        return { isValid: false, error: 'Invalid token format in deep link' };
      }
    }

    if (payload.id) {
      if (typeof payload.id !== 'string' || payload.id.length === 0) {
        return { isValid: false, error: 'Invalid resource ID in deep link' };
      }
    }

    return { isValid: true, sanitizedPayload: payload };
  }

  static validateResourceAccess(
    userRole: string | null | undefined,
    resourceType: string
  ): boolean {
    if (!userRole) return false;

    const allowedRoles: Record<string, string[]> = {
      building: ['property_owner', 'caretaker', 'admin', 'super_admin'],
      unit: ['property_owner', 'caretaker', 'admin', 'super_admin'],
      renter: ['property_owner', 'caretaker', 'admin', 'super_admin'],
      caretaker: ['property_owner', 'admin', 'super_admin'],
      'rent-record': ['property_owner', 'renter', 'admin', 'super_admin'],
      maintenance: ['property_owner', 'caretaker', 'renter', 'admin', 'super_admin'],
      visitor: ['property_owner', 'caretaker', 'renter', 'admin', 'super_admin'],
      agreement: ['property_owner', 'renter', 'caretaker', 'admin', 'super_admin'],
      document: ['property_owner', 'caretaker', 'renter', 'admin', 'super_admin'],
      subscription: ['property_owner', 'ca_partner', 'admin', 'super_admin'],
      notification: ['property_owner', 'renter', 'caretaker', 'ca_partner', 'admin', 'super_admin', 'support_executive'],
      payment: ['property_owner', 'renter', 'admin', 'super_admin'],
      invitation: ['property_owner', 'renter', 'admin', 'super_admin'],
    };

    const allowed = allowedRoles[resourceType] || [];
    return allowed.includes(userRole);
  }

  static sanitizeUrl(url: string): UrlValidationResult {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL is required' };
    }

    try {
      const parsed = new URL(url);

      const allowedScheme = [...SECURITY_CONSTANTS.ALLOWED_SCHEMES] as string[];
      if (!allowedScheme.includes(parsed.protocol.replace(':', ''))) {
        return { isValid: false, error: `Scheme not allowed: ${parsed.protocol}` };
      }

      if (parsed.protocol === 'https:' || parsed.protocol === 'rentsecure:') {
        const hasSensitiveParam = ['token', 'password', 'secret', 'key'].some((param) =>
          parsed.searchParams.has(param)
        );

        if (hasSensitiveParam) {
          return {
            isValid: false,
            error: 'URL contains sensitive parameters',
          };
        }

        return { isValid: true, sanitizedUrl: url };
      }

      return { isValid: false, error: `Scheme not allowed: ${parsed.protocol}` };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }
}
