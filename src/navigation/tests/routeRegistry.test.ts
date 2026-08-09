/**
 * Unit tests for navigation route registry and utilities.
 */

import {
  ROUTE_REGISTRY,
  ROUTE_MAP,
  PATH_TO_ROUTE_MAP,
} from '@/navigation/routes/routeRegistry';
import {
  ROLE_REDIRECT,
  ROLE_TAB_ACCESS,
  ROLE_EXTRA_ROUTES,
  ROLE_FEATURE_ACCESS,
  hasRoleAccess,
  canAccessFeature,
  getMinimumRoleLevel,
  getRoleDefaultRoute,
  getRoleTabAccess,
  getRoleExtraRoutes,
  getRoleFeatureAccess,
} from '@/navigation/routes/roleRoutes';
import {
  matchRoute,
  normalizePath,
  isAuthRoute,
  isProtectedRoute,
  isPublicRoute,
  canNavigateToRoute,
} from '@/navigation/utils/routeUtils';
import type { UserRole } from '@/navigation/types/navigation.types';

describe('Route Registry', () => {
  it('should have at least 80 routes registered', () => {
    expect(ROUTE_REGISTRY.length).toBeGreaterThanOrEqual(80);
  });

  it('should have unique route names', () => {
    const names = ROUTE_REGISTRY.map((r) => r.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('should have unique route paths', () => {
    const paths = ROUTE_REGISTRY.map((r) => r.path);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });

  it('should map every route name to its definition', () => {
    for (const route of ROUTE_REGISTRY) {
      expect(ROUTE_MAP[route.name]).toBe(route);
    }
  });

  it('should map every route path to its definition', () => {
    for (const route of ROUTE_REGISTRY) {
      expect(PATH_TO_ROUTE_MAP[route.path]).toBe(route);
    }
  });

  it('should have a valid group for every route', () => {
    const validGroups = ['auth', 'drawer', 'public'];
    for (const route of ROUTE_REGISTRY) {
      expect(validGroups).toContain(route.group);
    }
  });

  it('should mark all auth routes as public', () => {
    for (const route of ROUTE_REGISTRY) {
      if (route.group === 'auth') {
        expect(route.isPublic).toBe(true);
      }
    }
  });

  it('should not have empty route names', () => {
    for (const route of ROUTE_REGISTRY) {
      expect(route.name.length).toBeGreaterThan(0);
    }
  });

  it('should not have empty route paths', () => {
    for (const route of ROUTE_REGISTRY) {
      expect(route.path.length).toBeGreaterThan(0);
    }
  });
});

describe('Role Redirects', () => {
  const allRoles: UserRole[] = [
    'super_admin',
    'admin',
    'property_owner',
    'renter',
    'caretaker',
    'ca_partner',
    'support_executive',
    'user',
  ];

  it('should have a redirect for every role', () => {
    for (const role of allRoles) {
      expect(ROLE_REDIRECT[role]).toBeDefined();
      expect(ROLE_REDIRECT[role].length).toBeGreaterThan(0);
    }
  });

  it('should redirect user role to welcome', () => {
    expect(ROLE_REDIRECT.user).toBe('/(auth)/welcome');
  });

  it('should have tab access for every role', () => {
    for (const role of allRoles) {
      expect(ROLE_TAB_ACCESS[role]).toBeDefined();
      expect(Array.isArray(ROLE_TAB_ACCESS[role])).toBe(true);
    }
  });

  it('should have extra routes for every role', () => {
    for (const role of allRoles) {
      expect(ROLE_EXTRA_ROUTES[role]).toBeDefined();
      expect(Array.isArray(ROLE_EXTRA_ROUTES[role])).toBe(true);
    }
  });

  it('should have feature access for every role', () => {
    for (const role of allRoles) {
      expect(ROLE_FEATURE_ACCESS[role]).toBeDefined();
      expect(Array.isArray(ROLE_FEATURE_ACCESS[role])).toBe(true);
    }
  });

  it('should grant super_admin access to all features', () => {
    expect(ROLE_FEATURE_ACCESS.super_admin).toContain('*');
  });

  it('should grant admin access to all features', () => {
    expect(ROLE_FEATURE_ACCESS.admin).toContain('*');
  });
});

describe('Role Access Utilities', () => {
  it('hasRoleAccess should return true for wildcard', () => {
    expect(hasRoleAccess('property_owner', ['*'])).toBe(true);
  });

  it('hasRoleAccess should return true for matching role', () => {
    expect(hasRoleAccess('property_owner', ['property_owner'])).toBe(true);
  });

  it('hasRoleAccess should return false for non-matching role', () => {
    expect(hasRoleAccess('renter', ['property_owner'])).toBe(false);
  });

  it('hasRoleAccess should return false for null role', () => {
    expect(hasRoleAccess(null, ['property_owner'])).toBe(false);
  });

  it('canAccessFeature should return true for wildcard', () => {
    expect(canAccessFeature('super_admin', 'any-feature')).toBe(true);
  });

  it('canAccessFeature should return true for matching feature', () => {
    expect(canAccessFeature('property_owner', 'buildings')).toBe(true);
  });

  it('canAccessFeature should return false for non-matching feature', () => {
    expect(canAccessFeature('renter', 'buildings')).toBe(false);
  });

  it('getRoleDefaultRoute should return dashboard for owner', () => {
    expect(getRoleDefaultRoute('property_owner')).toBe('/(drawer)/(tabs)/dashboard');
  });

  it('getRoleDefaultRoute should return welcome for user', () => {
    expect(getRoleDefaultRoute('user')).toBe('/(auth)/welcome');
  });

  it('getRoleDefaultRoute should return welcome for null', () => {
    expect(getRoleDefaultRoute(null)).toBe('/(auth)/welcome');
  });
});

describe('Route Utilities', () => {
  it('normalizePath should remove trailing slash', () => {
    expect(normalizePath('/(drawer)/(tabs)/dashboard/')).toBe('/(drawer)/(tabs)/dashboard');
  });

  it('normalizePath should handle root path', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('isAuthRoute should return true for auth routes', () => {
    expect(isAuthRoute('/(auth)/login')).toBe(true);
    expect(isAuthRoute('/(auth)/welcome')).toBe(true);
  });

  it('isAuthRoute should return true for splash', () => {
    expect(isAuthRoute('/splash')).toBe(true);
  });

  it('isAuthRoute should return false for drawer routes', () => {
    expect(isAuthRoute('/(drawer)/(tabs)/dashboard')).toBe(false);
  });

  it('isProtectedRoute should return true for drawer routes', () => {
    expect(isProtectedRoute('/(drawer)/(tabs)/dashboard')).toBe(true);
  });

  it('isProtectedRoute should return false for auth routes', () => {
    expect(isProtectedRoute('/(auth)/login')).toBe(false);
  });

  it('isPublicRoute should return true for splash', () => {
    expect(isPublicRoute('/splash')).toBe(true);
  });

  it('isPublicRoute should return true for auth routes', () => {
    expect(isPublicRoute('/(auth)/login')).toBe(true);
  });

  it('isPublicRoute should return false for drawer routes', () => {
    expect(isPublicRoute('/(drawer)/(tabs)/dashboard')).toBe(false);
  });

  it('matchRoute should match exact paths', () => {
    const route = matchRoute('/(drawer)/(tabs)/dashboard');
    expect(route).toBeDefined();
    expect(route?.name).toBe('dashboard');
  });

  it('matchRoute should match parameterized paths', () => {
    const route = matchRoute('/(drawer)/(tabs)/buildings/123');
    expect(route).toBeDefined();
    expect(route?.name).toBe('building-detail');
  });

  it('matchRoute should return undefined for unknown routes', () => {
    const route = matchRoute('/unknown/path');
    expect(route).toBeUndefined();
  });

  it('canNavigateToRoute should allow public routes', () => {
    const result = canNavigateToRoute('/splash', null, false);
    expect(result.allowed).toBe(true);
  });

  it('canNavigateToRoute should deny unauthenticated access to protected routes', () => {
    const result = canNavigateToRoute('/(drawer)/(tabs)/dashboard', null, false);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Not authenticated');
  });

  it('canNavigateToRoute should deny insufficient permissions', () => {
    const result = canNavigateToRoute('/(drawer)/(tabs)/buildings', 'renter', true);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Insufficient permissions');
  });
});
