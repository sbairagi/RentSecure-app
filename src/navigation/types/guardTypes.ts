import type { UserRole } from './navigation.types';
import type { RouteDefinition } from './routeTypes';

export interface GuardContext {
  route: RouteDefinition;
  pathname: string;
  isAuthenticated: boolean;
  user: {
    id: number;
    role: string;
    permissions: string[];
  } | null;
  subscription: {
    isActive: boolean;
    isExpired: boolean;
    endDate: string | null;
  } | null;
  isMaintenanceMode: boolean;
  requiresUpdate: boolean;
}

export type GuardCheck = (context: GuardContext) => import('./navigation.types').GuardResult | Promise<import('./navigation.types').GuardResult>;

export interface AuthGuardConfig {
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  requirePermission?: import('./navigation.types').Permission | import('./navigation.types').Permission[];
  requireFeature?: string;
  requireSubscription?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}
