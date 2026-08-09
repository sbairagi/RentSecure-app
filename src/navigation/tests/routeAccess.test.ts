/**
 * Unit tests for route access control.
 */

import {
  ROLE_FEATURE_ACCESS,
  ROLE_TAB_ACCESS,
} from '@/navigation/routes/roleRoutes';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessFeature,
} from '@/navigation/utils/permissions';
import { matchRoute, canNavigateToRoute } from '@/navigation/utils/routeUtils';
import type { Permission, UserRole } from '@/navigation/types/navigation.types';

describe('Permission Checks', () => {
  const testCases: { role: UserRole; permission: Permission; expected: boolean }[] = [
    { role: 'super_admin', permission: 'dashboard:read', expected: true },
    { role: 'admin', permission: 'dashboard:read', expected: true },
    { role: 'property_owner', permission: 'dashboard:read', expected: true },
    { role: 'renter', permission: 'dashboard:read', expected: true },
    { role: 'caretaker', permission: 'dashboard:read', expected: true },
    { role: 'renter', permission: 'building:write', expected: false },
    { role: 'renter', permission: 'payment:read', expected: true },
    { role: 'user', permission: 'dashboard:read', expected: false },
  ];

  testCases.forEach(({ role, permission, expected }) => {
    it(`should ${expected ? 'allow' : 'deny'} ${role} access to ${permission}`, () => {
      expect(hasPermission(role, permission)).toBe(expected);
    });
  });

  it('hasAnyPermission should return true if any permission matches', () => {
    expect(hasAnyPermission('property_owner', ['building:read', 'ai:read'])).toBe(true);
  });

  it('hasAnyPermission should return false if no permissions match', () => {
    expect(hasAnyPermission('renter', ['building:read', 'ai:read'])).toBe(false);
  });

  it('hasAllPermissions should return true if all permissions match', () => {
    expect(hasAllPermissions('property_owner', ['dashboard:read', 'building:read'])).toBe(true);
  });

  it('hasAllPermissions should return false if any permission does not match', () => {
    expect(hasAllPermissions('renter', ['dashboard:read', 'building:read'])).toBe(false);
  });

  it('hasPermission should return false for null role', () => {
    expect(hasPermission(null, 'dashboard:read')).toBe(false);
  });
});

describe('Feature Access', () => {
  it('should allow property_owner to access buildings', () => {
    expect(canAccessFeature('property_owner', 'buildings')).toBe(true);
  });

  it('should deny renter access to buildings', () => {
    expect(canAccessFeature('renter', 'buildings')).toBe(false);
  });

  it('should allow super_admin to access any feature', () => {
    expect(canAccessFeature('super_admin', 'any-feature')).toBe(true);
  });

  it('should return false for null role', () => {
    expect(canAccessFeature(null, 'buildings')).toBe(false);
  });
});

describe('Route Access Control', () => {
  it('should allow property_owner to access buildings', () => {
    const result = canNavigateToRoute('/(drawer)/(tabs)/buildings', 'property_owner', true);
    expect(result.allowed).toBe(true);
  });

  it('should deny renter access to buildings', () => {
    const result = canNavigateToRoute('/(drawer)/(tabs)/buildings', 'renter', true);
    expect(result.allowed).toBe(false);
  });

  it('should deny unauthenticated access to protected routes', () => {
    const result = canNavigateToRoute('/(drawer)/(tabs)/buildings', null, false);
    expect(result.allowed).toBe(false);
  });

  it('should allow authenticated owner to access dashboard', () => {
    const result = canNavigateToRoute('/(drawer)/(tabs)/dashboard', 'property_owner', true);
    expect(result.allowed).toBe(true);
  });

  it('should redirect to dashboard when access denied', () => {
    const result = canNavigateToRoute('/(drawer)/(tabs)/buildings', 'renter', true);
    expect(result.allowed).toBe(false);
    expect(result.redirectTo).toBe('/(drawer)/(tabs)/dashboard');
  });
});

describe('Tab Access', () => {
  it('should include properties tab for property_owner', () => {
    expect(ROLE_TAB_ACCESS.property_owner).toContain('properties');
  });

  it('should not include properties tab for renter', () => {
    expect(ROLE_TAB_ACCESS.renter).not.toContain('properties');
  });

  it('should include search tab for caretaker', () => {
    expect(ROLE_TAB_ACCESS.caretaker).toContain('search');
  });

  it('should not include visitors tab for renter', () => {
    expect(ROLE_TAB_ACCESS.renter).not.toContain('visitors');
  });
});
