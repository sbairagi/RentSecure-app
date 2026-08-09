import type { DeepLinkConfig, DeepLinkRouteMapping, DeepLinkPayload, DeepLinkType } from '@/navigation/types';
import { DEEP_LINK_SCHEME, DEEP_LINK_HOST, DEEP_LINK_PREFIXES, DEEP_LINK_ROUTE_MAP, DEEP_LINK_RESOURCE_ROLES } from '@/navigation/constants';

export const DEEP_LINK_CONFIG: DeepLinkConfig = {
  scheme: DEEP_LINK_SCHEME,
  host: DEEP_LINK_HOST,
  prefixes: [...DEEP_LINK_PREFIXES] as string[],
  routes: {
    [DEEP_LINK_SCHEME]: {
      pattern: `${DEEP_LINK_SCHEME}://:resource/:id?/:action?`,
      routeName: ':resource',
      requiredRoles: [],
      requiresAuth: true,
      paramExtractors: {
        resource: (segments) => segments[0],
        id: (segments) => segments[1],
        action: (segments) => segments[2],
      },
    },
    [DEEP_LINK_HOST]: {
      pattern: `https://${DEEP_LINK_HOST}/:resource/:id?/:action?`,
      routeName: ':resource',
      requiredRoles: [],
      requiresAuth: true,
      paramExtractors: {
        resource: (segments) => segments[0],
        id: (segments) => segments[1],
        action: (segments) => segments[2],
      },
    },
  },
};

export const RESOURCE_TYPE_TO_DEEP_LINK: Record<string, DeepLinkType> = {
  building: 'building',
  unit: 'unit',
  renter: 'renter',
  caretaker: 'caretaker',
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
};

export const getDeepLinkRouteForResource = (
  resourceType: string,
  resourceId?: string
): { route: string; params: Record<string, string> } | null => {
  const routePattern = DEEP_LINK_ROUTE_MAP[resourceType];
  if (!routePattern) return null;

  const route = routePattern.replace(/:id?/g, resourceId || '').replace(/\/$/, '');
  const params: Record<string, string> = {};
  if (resourceId) {
    params.id = resourceId;
  }
  return { route, params };
};

export const getRequiredRolesForResource = (resourceType: string): string[] => {
  return DEEP_LINK_RESOURCE_ROLES[resourceType] || [];
};

export const isDeepLinkResourceAllowed = (
  resourceType: string,
  userRole: string | null | undefined
): boolean => {
  if (!userRole) return false;
  const allowedRoles = getRequiredRolesForResource(resourceType);
  if (allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};
