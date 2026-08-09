// Guards
export { RouteGuard, AuthGuard, PermissionGuard, SubscriptionGuard } from './guards';

// Deep Links
export {
  DEEP_LINK_CONFIG,
  RESOURCE_TYPE_TO_DEEP_LINK,
  getDeepLinkRouteForResource,
  getRequiredRolesForResource,
  isDeepLinkResourceAllowed,
} from './deep-links';
export {
  parseDeepLink,
  validateDeepLink,
  sanitizeDeepLinkPayload,
} from './deep-links';
export { useDeepLinkNavigator } from './deep-links';

// Notification Routing
export {
  categorizeNotification,
  extractResourceId,
  parseNotificationPayload,
} from './notification-routing';
export {
  getRouteForNotification,
  createNotificationRouterState,
  routeNotification,
} from './notification-routing';
export { useNotificationHandler } from './notification-routing';

// Navigation State
export {
  navigationStateStore,
  pendingDeepLinkStore,
  pendingNotificationStore,
  navigationReadyStore,
} from './navigation-state';
export type {
  NavigationReadyState,
  PendingDeepLink,
  PendingNotification,
  NavigationStateManager,
} from './navigation-state';

// Routes
export {
  ROUTE_REGISTRY,
  ROUTE_MAP,
  PATH_TO_ROUTE_MAP,
} from './routes';
export {
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
} from './routes';

// Linking
export { createExpoLinkingConfig, getDeepLinkPrefixes, getDeepLinkScheme, getDeepLinkHost } from './linking';
export type { ExpoLinkingConfig } from './linking';

// Hooks
export { useNavigationAnalytics } from './hooks/useNavigationAnalytics';
export type { NavigationEvent } from './hooks/useNavigationAnalytics';

// Types
export * from './types';

// Legacy exports (backward compatibility)
export {
  FEATURE_PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRequiredPermissions,
} from './utils';
export {
  isSubscriptionExpired,
  getDaysRemaining,
  getSubscriptionStatus,
  checkFeatureAccess,
  checkSubscriptionAccess,
  fetchSubscriptionData,
  getAddOnLimit,
} from './utils';
export {
  matchRoute,
  normalizePath,
  isAuthRoute,
  isProtectedRoute,
  isPublicRoute,
  checkRoutePermission,
  getRouteParams,
  canNavigateToRoute,
} from './utils';
export {
  sanitizeRouteInput,
  sanitizeResourceId,
  sanitizeToken,
  isSensitiveParameter,
  sanitizeQueryParams,
  validateDeepLinkSecurity,
} from './utils';
