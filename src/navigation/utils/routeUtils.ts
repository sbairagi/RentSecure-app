import type { RouteDefinition, UserRole, Permission } from '@/navigation/types';
import { PATH_TO_ROUTE_MAP } from '@/navigation/routes';

export function matchRoute(pathname: string): RouteDefinition | undefined {
  const normalizedPath = normalizePath(pathname);

  if (PATH_TO_ROUTE_MAP[normalizedPath]) {
    return PATH_TO_ROUTE_MAP[normalizedPath];
  }

  for (const [path, route] of Object.entries(PATH_TO_ROUTE_MAP)) {
    if (path.includes('[id]')) {
      const pattern = path.replace(/\[id\]/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(normalizedPath)) {
        return route;
      }
    }
  }

  return undefined;
}

export function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

export function isAuthRoute(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return (
    normalized === '/splash' ||
    normalized.startsWith('/(auth)')
  );
}

export function isProtectedRoute(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return normalized.startsWith('/(drawer)');
}

export function isPublicRoute(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  return (
    normalized === '/splash' ||
    normalized === '/not-found' ||
    normalized.startsWith('/(auth)')
  );
}

export function checkRoutePermission(
  route: RouteDefinition | undefined,
  userRole: UserRole | null | undefined
): boolean {
  if (!route) return false;
  if (!userRole) return false;

  if (route.requiredRoles && route.requiredRoles.length > 0) {
    if (!route.requiredRoles.includes(userRole)) {
      return false;
    }
  }

  if (route.requiredPermissions && route.requiredPermissions.length > 0) {
    const { hasAnyPermission } = require('@/navigation/utils/permissions');
    if (!hasAnyPermission(userRole, route.requiredPermissions)) {
      return false;
    }
  }

  return true;
}

export function getRouteParams(pathname: string, route: RouteDefinition): Record<string, string> {
  const params: Record<string, string> = {};
  const routeParts = route.path.split('/');
  const pathParts = pathname.split('/');

  let paramIndex = 0;
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith('[') && routeParts[i].endsWith(']')) {
      const paramName = routeParts[i].slice(1, -1);
      if (pathParts[i]) {
        params[paramName] = pathParts[i];
      }
    }
  }

  return params;
}

export function canNavigateToRoute(
  pathname: string,
  userRole: UserRole | null | undefined,
  isAuthenticated: boolean
): { allowed: boolean; reason?: string; redirectTo?: string } {
  const route = matchRoute(pathname);

  if (!route) {
    return { allowed: false, reason: 'Route not found', redirectTo: '/(drawer)/(tabs)/dashboard' };
  }

  if (route.isPublic) {
    return { allowed: true };
  }

  if (!isAuthenticated) {
    return { allowed: false, reason: 'Not authenticated', redirectTo: '/(auth)/welcome' };
  }

  if (!checkRoutePermission(route, userRole)) {
    return {
      allowed: false,
      reason: 'Insufficient permissions',
      redirectTo: '/(drawer)/(tabs)/dashboard',
    };
  }

  return { allowed: true };
}
