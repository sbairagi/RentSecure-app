import { useNavigationAnalytics } from '@/navigation/hooks/useNavigationAnalytics';
import {
  mapBackendRole,
  type Permission,
  type UserRole,
} from '@/navigation/types/navigation.types';
import { hasPermission } from '@/navigation/utils/permissions';
import { ROLE_REDIRECT } from '@/navigation/utils/roleRedirect';
import { fetchSubscriptionData, isSubscriptionExpired } from '@/navigation/utils/subscription';
import { apiService } from '@/services/api/apiClient';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Redirect, usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type GuardPhase = 'loading' | 'checking' | 'ready';

const AUTH_ROUTES = [
  '/(auth)/welcome',
  '/(auth)/login',
  '/(auth)/register',
  '/(auth)/forgot-password',
  '/(auth)/otp',
  '/(auth)/verify-otp',
  '/(auth)/reset-password',
  '/(auth)/create-password',
  '/(auth)/session-expired',
];
const AUTH_ROUTE_PATHS = AUTH_ROUTES.map((r) => r.replace(/^\/(\([^)]+\)|[^/]+)\//, '/'));
const SPLASH_ROUTE = '/splash';
const MAINTENANCE_ROUTE = '/(auth)/maintenance';
const UPGRADE_ROUTE = '/(drawer)/(tabs)/subscription';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  requirePermission?: Permission | Permission[];
  requireFeature?: string;
  requireSubscription?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RouteGuard({
  children,
  requireAuth = false,
  requireRole,
  requirePermission,
  requireFeature,
  requireSubscription = false,
  allowedRoles,
  redirectTo,
  fallback,
}: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, accessToken } = useAuthStore();
  const { subscription, isLoading: subLoading } = useSubscriptionStore();
  const [phase, setPhase] = useState<GuardPhase>('loading');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [requiresUpdate, setRequiresUpdate] = useState(false);
  const initializedRef = useRef(false);

  const currentRole: UserRole = mapBackendRole(user?.role);

  const canAccessRoute = useCallback(
    (route: string): boolean => {
      if (!isAuthenticated) return false;

      const isAuthRoute = AUTH_ROUTES.some((r) => route.startsWith(r)) || route === SPLASH_ROUTE;
      if (isAuthRoute) return false;

      if (allowedRoles && allowedRoles.length > 0) {
        const hasAccess = allowedRoles.some((r) => r === currentRole);
        if (!hasAccess) return false;
      }

      if (requireRole) {
        const requiredRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
        if (!requiredRoles.includes(currentRole)) return false;
      }

      if (requirePermission) {
        const requiredPerms = Array.isArray(requirePermission)
          ? requirePermission
          : [requirePermission];
        const hasAccess = requiredPerms.some((perm) => hasPermission(currentRole, perm));
        if (!hasAccess) return false;
      }

      if (requireFeature) {
        const features = ROLE_REDIRECT;
      }

      if (requireSubscription) {
        if (!subscription || isSubscriptionExpired(subscription.end_date)) {
          return false;
        }
      }

      return true;
    },
    [
      isAuthenticated,
      currentRole,
      subscription,
      requireRole,
      requirePermission,
      requireFeature,
      requireSubscription,
      allowedRoles,
    ]
  );

  const canAccessRouteRef = useRef(canAccessRoute);
  canAccessRouteRef.current = canAccessRoute;

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      if (!accessToken) {
        setPhase('ready');
        return;
      }

      try {
        const maintenanceRes = await apiService
          .get<{ isMaintenance: boolean; message?: string }>('/auth/maintenance/')
          .catch(() => ({ isMaintenance: false }) as any);

        const maintenanceData =
          (maintenanceRes as any)?.isMaintenance !== undefined
            ? maintenanceRes
            : { isMaintenance: false };

        if (maintenanceData.isMaintenance) {
          setMaintenanceMode(true);
          setMaintenanceMessage(maintenanceData.message || 'App is under maintenance');
        }

        const versionRes = await apiService
          .get<{ isUpdateRequired: boolean; isOptional: boolean; latestVersion: string }>(
            '/auth/app/version/'
          )
          .catch(() => ({ isUpdateRequired: false }) as any);

        const versionData =
          (versionRes as any)?.isUpdateRequired !== undefined
            ? versionRes
            : { isUpdateRequired: false };

        if (versionData.isUpdateRequired) {
          setRequiresUpdate(true);
        }
      } catch {
        // Continue even if checks fail
      }

      try {
        await fetchSubscriptionData();
      } catch {
        // Continue even if subscription fetch fails
      }

      setPhase('ready');
    };

    init();
  }, [accessToken]);

  useEffect(() => {
    if (phase !== 'ready') return;
    if (authLoading) return;

    if (maintenanceMode && isAuthenticated) {
      return;
    }

    if (requiresUpdate && isAuthenticated) {
      return;
    }

    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo || '/(auth)/welcome');
      return;
    }

    if (isAuthenticated && !canAccessRouteRef.current(pathname)) {
      const targetRoute = redirectTo || ROLE_REDIRECT[currentRole] || '/(auth)/welcome';
      router.replace(targetRoute);
      return;
    }

    if (!isAuthenticated) {
      const isPublicRoute =
        pathname === SPLASH_ROUTE ||
        AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`)) ||
        AUTH_ROUTE_PATHS.some((r) => pathname === r || pathname.startsWith(`${r}/`));

      if (!isPublicRoute) {
        console.log('[RouteGuard] redirecting unauthenticated from', pathname, 'to /(auth)/welcome');
        router.replace('/(auth)/welcome');
      } else {
        console.log('[RouteGuard] allowing public route', pathname);
      }
    }
  }, [
    phase,
    authLoading,
    isAuthenticated,
    pathname,
    currentRole,
    router,
    maintenanceMode,
    requiresUpdate,
    requireAuth,
    redirectTo,
  ]);

  useNavigationAnalytics();

  if (phase === 'loading' || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (maintenanceMode && isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        {fallback || <Redirect href={MAINTENANCE_ROUTE} />}
      </View>
    );
  }

  if (requiresUpdate && isAuthenticated) {
    return <>{fallback || <Redirect href="/(auth)/session-expired" />}</>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Redirect href={redirectTo || '/(auth)/welcome'} />;
  }

  if (isAuthenticated && !canAccessRouteRef.current(pathname)) {
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
