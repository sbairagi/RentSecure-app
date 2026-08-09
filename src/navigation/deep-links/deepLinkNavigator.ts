import type { DeepLinkPayload, DeepLinkType, UserRole } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { parseDeepLink, validateDeepLink } from './deepLinkParser';
import { sanitizeDeepLinkPayload } from './deepLinkValidator';
import { DEEP_LINK_ROUTE_MAP, DEEP_LINK_RESOURCE_ROLES } from '@/navigation/constants';
import { mapBackendRole } from '@/navigation/types/navigation.types';
import { pendingDeepLinkStore } from '@/navigation/navigation-state';

export interface DeepLinkNavigationResult {
  success: boolean;
  route?: string;
  error?: string;
  requiresAuth?: boolean;
}

export function useDeepLinkNavigator() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const currentRole: UserRole = mapBackendRole(user?.role);

  const navigateToDeepLink = useCallback(
    async (url: string | null | undefined): Promise<DeepLinkNavigationResult> => {
      if (!url) {
        return { success: false, error: 'No URL provided' };
      }

      const parsed = parseDeepLink(url);
      if (!parsed) {
        return { success: false, error: 'Invalid deep link' };
      }

      const payload = parsed.payload;
      const routeName = parsed.routeName;
      const params = parsed.params;
      const sanitizedPayload = sanitizeDeepLinkPayload(payload);

      const validation = validateDeepLink(sanitizedPayload, user?.role);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      if (sanitizedPayload.type === 'general') {
        return {
          success: true,
          route: '/(drawer)/(tabs)/dashboard',
        };
      }

      const targetRoute = getRouteForPayload(sanitizedPayload, routeName, params);
      if (!targetRoute) {
        return { success: false, error: 'No route found for resource type' };
      }

      if (!isAuthenticated) {
        return {
          success: false,
          requiresAuth: true,
          error: 'Authentication required',
          route: targetRoute,
        };
      }

      const allowed = isResourceAllowed(sanitizedPayload.type, currentRole);
      if (!allowed) {
        return {
          success: false,
          error: 'Access denied for this resource type',
          route: '/(drawer)/(tabs)/dashboard',
        };
      }

      return {
        success: true,
        route: targetRoute,
      };
    },
    [isAuthenticated, currentRole, router]
  );

  const handleDeepLinkNavigation = useCallback(
    async (url: string | null | undefined): Promise<void> => {
      if (authLoading) return;

      const result = await navigateToDeepLink(url);

      if (!result.success && result.requiresAuth && result.route) {
        pendingDeepLinkStore.set({
          route: result.route,
          timestamp: Date.now(),
        });
        router.replace('/(auth)/welcome');
        return;
      }

      if (result.success && result.route) {
        router.replace(result.route as any);
      }
    },
    [navigateToDeepLink, router, authLoading]
  );

  return {
    navigateToDeepLink,
    handleDeepLinkNavigation,
    parseDeepLink,
    validateDeepLink,
  };
}

function getRouteForPayload(
  payload: DeepLinkPayload,
  _routeName: string,
  _params: Record<string, string>
): string | null {
  const resourceType = getResourceTypeFromPayload(payload);

  if (resourceType && DEEP_LINK_ROUTE_MAP[resourceType]) {
    let route = DEEP_LINK_ROUTE_MAP[resourceType];
    if (payload.id) {
      route = route.replace(/:id/, payload.id);
    }
    if (payload.token) {
      route = route.replace(/:token/, payload.token);
    }
    return route;
  }

  return null;
}

function getResourceTypeFromPayload(payload: DeepLinkPayload): string | null {
  const typeMap: Partial<Record<DeepLinkType, string | null>> = {
    building: 'building',
    unit: 'unit',
    renter: 'renter',
    caretaker: 'caretaker',
    rent_record: 'rent',
    maintenance: 'maintenance',
    visitor: 'visitor',
    agreement: 'agreement',
    document: 'document',
    subscription: 'subscription',
    notification: 'notification',
    payment: 'payment',
    invitation: 'invitation',
    general: null,
  };

  return typeMap[payload.type] || null;
}

function isResourceAllowed(resourceType: DeepLinkType, userRole: UserRole): boolean {
  const allowedRoles = DEEP_LINK_RESOURCE_ROLES[resourceType] || [];
  if (allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
}
