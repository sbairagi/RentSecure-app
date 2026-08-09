import type { NotificationPayload, NotificationRouterState } from '@/navigation/types';
import { NOTIFICATION_ROUTE_MAP } from '@/navigation/constants';
import { parseNotificationPayload } from './notificationPayload';

export function getRouteForNotification(
  notification: NotificationPayload,
  userRole?: string | null
): { route: string; resourceId?: string } | null {
  const routeConfig = NOTIFICATION_ROUTE_MAP[notification.category];
  if (!routeConfig) {
    return { route: '/(drawer)/(tabs)/notifications/list' };
  }

  const route = routeConfig.route;
  const resourceId = notification.resourceId;

  if (resourceId && routeConfig.resourceType) {
    const resourceRoute = getResourceDetailRoute(routeConfig.resourceType, resourceId);
    if (resourceRoute) {
      return { route: resourceRoute, resourceId };
    }
  }

  return { route, resourceId };
}

function getResourceDetailRoute(
  resourceType: string,
  resourceId: string
): string | null {
  const routeMap: Record<string, string> = {
    rent_record: '/(drawer)/(tabs)/payments/rent-record/[id]',
    maintenance: '/(drawer)/(tabs)/maintenance/[id]',
    visitor: '/(drawer)/(tabs)/visitors/[id]',
    agreement: '/(drawer)/(tabs)/agreements/[id]',
    renter: '/(drawer)/(tabs)/renters/[id]',
    unit: '/(drawer)/(tabs)/units/[id]',
    building: '/(drawer)/(tabs)/buildings/[id]',
    caretaker: '/(drawer)/(tabs)/caretakers/[id]',
    document: '/(drawer)/(tabs)/buildings/[id]',
    subscription: '/(drawer)/(tabs)/subscription',
  };

  const pattern = routeMap[resourceType];
  if (!pattern) return null;

  return pattern.replace('[id]', resourceId);
}

export function createNotificationRouterState(): NotificationRouterState {
  return {
    pendingNotification: null,
    isRouting: false,
    lastRoutedAt: null,
    error: null,
  };
}

export function routeNotification(
  notification: { id: string; title: string; message: string; data?: Record<string, any> },
  userRole?: string | null
): { success: boolean; route?: string; resourceId?: string; error?: string } {
  try {
    const payload = parseNotificationPayload(notification);
    const result = getRouteForNotification(payload, userRole);

    if (!result) {
      return { success: false, error: 'Could not determine route for notification' };
    }

    return {
      success: true,
      route: result.route,
      resourceId: result.resourceId,
    };
  } catch (error) {
    return { success: false, error: 'Failed to parse notification' };
  }
}
