import type { UserRole, Permission } from './navigation.types';

export interface RouteDefinition {
  name: string;
  path: string;
  group: RouteGroup;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requiresSubscription?: boolean;
  featureKey?: string;
  deepLinkPattern?: string;
  isPublic?: boolean;
  children?: RouteDefinition[];
}

export type RouteGroup = 'auth' | 'drawer' | 'public';

export interface RouteAccessResult {
  allowed: boolean;
  reason?: string;
  redirectTo?: string;
}

export interface RouteMatch {
  route: RouteDefinition;
  params: Record<string, string>;
}
