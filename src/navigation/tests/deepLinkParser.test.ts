/**
 * Unit tests for deep link parsing, validation, and navigation.
 */

import { parseDeepLink, validateDeepLink, sanitizeDeepLinkPayload } from '@/navigation/deep-links/deepLinkParser';
import {
  DEEP_LINK_CONFIG,
  getDeepLinkRouteForResource,
  getRequiredRolesForResource,
  isDeepLinkResourceAllowed,
} from '@/navigation/deep-links/deepLinkConfig';

describe('Deep Link Parser', () => {
  it('should parse building deep link', () => {
    const result = parseDeepLink('rentsecure://building/123');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('building');
    expect(result?.payload.id).toBe('123');
  });

  it('should parse unit deep link', () => {
    const result = parseDeepLink('rentsecure://unit/456');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('unit');
    expect(result?.payload.id).toBe('456');
  });

  it('should parse renter deep link', () => {
    const result = parseDeepLink('rentsecure://renter/789');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('renter');
    expect(result?.payload.id).toBe('789');
  });

  it('should parse rent-record deep link', () => {
    const result = parseDeepLink('rentsecure://rent/100');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('rent_record');
    expect(result?.payload.id).toBe('100');
  });

  it('should parse maintenance deep link', () => {
    const result = parseDeepLink('rentsecure://maintenance/200');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('maintenance');
    expect(result?.payload.id).toBe('200');
  });

  it('should parse visitor deep link', () => {
    const result = parseDeepLink('rentsecure://visitor/300');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('visitor');
    expect(result?.payload.id).toBe('300');
  });

  it('should parse agreement deep link', () => {
    const result = parseDeepLink('rentsecure://agreement/400');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('agreement');
    expect(result?.payload.id).toBe('400');
  });

  it('should parse subscription deep link', () => {
    const result = parseDeepLink('rentsecure://subscription');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('subscription');
  });

  it('should parse universal link', () => {
    const result = parseDeepLink('https://app.rentsecureapp.com/building/123');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('building');
    expect(result?.payload.id).toBe('123');
  });

  it('should return null for invalid URL', () => {
    const result = parseDeepLink('not-a-url');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(false);
  });

  it('should return null for empty URL', () => {
    const result = parseDeepLink('');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(false);
  });

  it('should parse deep link with action', () => {
    const result = parseDeepLink('rentsecure://agreement/400/sign');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.action).toBe('sign');
  });

  it('should parse deep link with query params', () => {
    const result = parseDeepLink('rentsecure://payment/abc123?token=xyz');
    expect(result).not.toBeNull();
    expect(result?.isValid).toBe(true);
    expect(result?.payload.type).toBe('payment');
  });
});

describe('Deep Link Validator', () => {
  it('should reject missing type', () => {
    const result = validateDeepLink({} as any);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Missing resource type');
  });

  it('should reject missing ID for resource types', () => {
    const result = validateDeepLink({ type: 'building' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Missing resource ID');
  });

  it('should reject missing token for payment/invitation', () => {
    const result = validateDeepLink({ type: 'payment' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Missing token');
  });

  it('should reject invalid resource ID format', () => {
    const result = validateDeepLink({ type: 'building', id: 'invalid id with spaces!' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid resource ID format');
  });

  it('should accept valid resource ID', () => {
    const result = validateDeepLink({ type: 'building', id: 'abc123' });
    expect(result.valid).toBe(true);
  });

  it('should accept valid token', () => {
    const result = validateDeepLink({ type: 'payment', token: 'abc123' });
    expect(result.valid).toBe(true);
  });

  it('should accept general type without ID', () => {
    const result = validateDeepLink({ type: 'general' });
    expect(result.valid).toBe(true);
  });
});

describe('Deep Link Sanitizer', () => {
  it('should sanitize token', () => {
    const result = sanitizeDeepLinkPayload({ type: 'payment', token: 'abc\n\r\t123' });
    expect(result.token).toBe('abc123');
  });

  it('should sanitize resource ID', () => {
    const result = sanitizeDeepLinkPayload({ type: 'building', id: 'abc!@#123' });
    expect(result.id).toBe('abc123');
  });

  it('should remove sensitive fields', () => {
    const result = sanitizeDeepLinkPayload({
      type: 'building',
      id: '123',
      redirect: 'https://evil.com',
      url: 'https://evil.com',
      link: 'https://evil.com',
      href: 'https://evil.com',
    });
    expect(result.redirect).toBeUndefined();
    expect(result.url).toBeUndefined();
    expect(result.link).toBeUndefined();
    expect(result.href).toBeUndefined();
  });
});

describe('Deep Link Config', () => {
  it('should have correct scheme', () => {
    expect(DEEP_LINK_CONFIG.scheme).toBe('rentsecure');
  });

  it('should have correct host', () => {
    expect(DEEP_LINK_CONFIG.host).toBe('app.rentsecureapp.com');
  });

  it('should have prefixes', () => {
    expect(DEEP_LINK_CONFIG.prefixes.length).toBeGreaterThan(0);
  });

  it('should have routes for common resources', () => {
    expect(getDeepLinkRouteForResource('building', '123')).not.toBeNull();
    expect(getDeepLinkRouteForResource('unit', '456')).not.toBeNull();
    expect(getDeepLinkRouteForResource('renter', '789')).not.toBeNull();
    expect(getDeepLinkRouteForResource('maintenance', '100')).not.toBeNull();
    expect(getDeepLinkRouteForResource('visitor', '200')).not.toBeNull();
    expect(getDeepLinkRouteForResource('agreement', '300')).not.toBeNull();
    expect(getDeepLinkRouteForResource('subscription')).not.toBeNull();
  });

  it('should return null for unknown resource type', () => {
    expect(getDeepLinkRouteForResource('unknown')).toBeNull();
  });

  it('should have required roles for resources', () => {
    const buildingRoles = getRequiredRolesForResource('building');
    expect(buildingRoles.length).toBeGreaterThan(0);
    expect(buildingRoles).toContain('property_owner');
  });

  it('should allow property_owner for building', () => {
    expect(isDeepLinkResourceAllowed('building', 'property_owner')).toBe(true);
  });

  it('should deny renter for building', () => {
    expect(isDeepLinkResourceAllowed('building', 'renter')).toBe(false);
  });

  it('should allow renter for rent-record', () => {
    expect(isDeepLinkResourceAllowed('rent-record', 'renter')).toBe(true);
  });
});
