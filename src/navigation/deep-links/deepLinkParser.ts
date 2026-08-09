import type { DeepLinkPayload, DeepLinkType, ParsedDeepLink } from '@/navigation/types';
import { DEEP_LINK_CONFIG, isDeepLinkResourceAllowed } from './deepLinkConfig';
import { DEEP_LINK_PATTERNS } from '@/navigation/constants';

export function parseDeepLink(url: string): ParsedDeepLink | null {
  try {
    const parsed = new URL(url);

    let resourceType: string | undefined;
    let resourceId: string | undefined;
    let action: string | undefined;
    let token: string | undefined;

    if (parsed.protocol === `${DEEP_LINK_CONFIG.scheme}:`) {
      const path = parsed.pathname.replace(/^\//, '');
      const segments = path.split('/').filter(Boolean);

      if (segments.length === 0) {
        return {
          raw: url,
          payload: { type: 'general' as DeepLinkType, action: 'open' },
          routeName: 'dashboard',
          params: {},
          isValid: true,
        };
      }

      resourceType = segments[0];
      resourceId = segments[1];
      action = segments[2];
      token = parsed.searchParams.get('token') || undefined;
    } else if (parsed.hostname === DEEP_LINK_CONFIG.host) {
      const path = parsed.pathname.replace(/^\//, '');
      const segments = path.split('/').filter(Boolean);

      resourceType = segments[0];
      resourceId = segments[1];
      action = segments[2];
      token = parsed.searchParams.get('token') || undefined;
    }

    if (!resourceType) {
      return {
        raw: url,
        payload: { type: 'general' as DeepLinkType },
        routeName: 'dashboard',
        params: {},
        isValid: false,
        validationError: 'No resource type found in URL',
      };
    }

    const mappedType = mapResourceType(resourceType);
    const payload: DeepLinkPayload = {
      type: mappedType,
    };

    if (resourceId) {
      payload.id = resourceId;
    }
    if (action) {
      payload.action = action;
    }
    if (token) {
      payload.token = token;
    }

    const routeName = getRouteNameForResource(resourceType);
    const params: Record<string, string> = {};
    if (resourceId) params.id = resourceId;
    if (token) params.token = token;

    return {
      raw: url,
      payload,
      routeName,
      params,
      isValid: true,
    };
  } catch {
    return {
      raw: url,
      payload: { type: 'general' as DeepLinkType },
      routeName: 'dashboard',
      params: {},
      isValid: false,
      validationError: 'Invalid URL format',
    };
  }
}

function mapResourceType(resource: string): DeepLinkType {
  const resourceMap: Record<string, DeepLinkType> = {
    building: 'building',
    unit: 'unit',
    renter: 'renter',
    caretaker: 'caretaker',
    rent: 'rent_record',
    'rent-record': 'rent_record',
    'rent-record-detail': 'rent_record',
    maintenance: 'maintenance',
    visitor: 'visitor',
    agreement: 'agreement',
    document: 'document',
    subscription: 'subscription',
    notification: 'notification',
    payment: 'payment',
    invitation: 'invitation',
    'onboard-renter': 'invitation',
    property: 'building',
  };

  return resourceMap[resource] || 'general';
}

function getRouteNameForResource(resource: string): string {
  const routeMap: Record<string, string> = {
    building: 'building-detail',
    unit: 'unit-detail',
    renter: 'renter-detail',
    caretaker: 'caretaker-detail',
    rent: 'rent-record-detail',
    'rent-record': 'rent-record-detail',
    'rent-record-detail': 'rent-record-detail',
    maintenance: 'maintenance-detail',
    visitor: 'visitor-detail',
    agreement: 'agreement-detail',
    document: 'buildings',
    subscription: 'subscription',
    notification: 'notifications-list',
    payment: 'payment-link',
    invitation: 'invitation',
    'onboard-renter': 'invitation',
    property: 'buildings',
  };

  return routeMap[resource] || 'dashboard';
}

export function validateDeepLink(
  payload: DeepLinkPayload,
  userRole?: string | null
): { valid: boolean; error?: string } {
  if (!payload.type) {
    return { valid: false, error: 'Missing resource type' };
  }

  if ((payload.type === 'building' || payload.type === 'unit' || payload.type === 'renter' ||
       payload.type === 'caretaker' || payload.type === 'rent_record' || payload.type === 'maintenance' ||
       payload.type === 'visitor' || payload.type === 'agreement' || payload.type === 'document' ||
       payload.type === 'notification') && !payload.id) {
    return { valid: false, error: 'Missing resource ID' };
  }

  if ((payload.type === 'payment' || payload.type === 'invitation') && !payload.token) {
    return { valid: false, error: 'Missing token' };
  }

  if (payload.id && !isValidResourceId(payload.id)) {
    return { valid: false, error: 'Invalid resource ID format' };
  }

  return { valid: true };
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
