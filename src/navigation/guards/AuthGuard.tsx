import type { UserRole } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { useRouter, Redirect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { checkSubscriptionAccess, getSubscriptionStatus } from '@/navigation/utils/subscription';
import { ROLE_REDIRECT, getRoleDefaultRoute } from '@/navigation/routes';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

type GuardPhase = 'loading' | 'checking' | 'ready';

export function AuthGuard({
  children,
  requireAuth = false,
  requireRole,
  allowedRoles,
  redirectTo,
  fallback,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const [phase, setPhase] = useState<GuardPhase>('loading');

  const currentRole = user?.role as UserRole | undefined;

  const requiredRoles = requireRole
    ? Array.isArray(requireRole)
      ? requireRole
      : [requireRole]
    : allowedRoles || [];

  const hasRequiredRole = useCallback((): boolean => {
    if (requiredRoles.length === 0) return true;
    if (!currentRole) return false;
    return requiredRoles.includes(currentRole);
  }, [currentRole, requiredRoles]);

  useEffect(() => {
    if (phase === 'ready') return;

    const check = async () => {
      if (requireAuth && !isAuthenticated) {
        setPhase('ready');
        return;
      }

      if (!isAuthenticated) {
        setPhase('ready');
        return;
      }

      if (!hasRequiredRole()) {
        const targetRoute = redirectTo || getRoleDefaultRoute(currentRole);
        router.replace(targetRoute);
        setPhase('ready');
        return;
      }

      setPhase('ready');
    };

    check();
  }, [isAuthenticated, currentRole, requireAuth, hasRequiredRole, redirectTo, router, phase]);

  if (phase === 'loading' || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Redirect href={redirectTo || '/(auth)/welcome'} />;
  }

  if (isAuthenticated && !hasRequiredRole()) {
    const targetRoute = redirectTo || getRoleDefaultRoute(currentRole);
    return <Redirect href={targetRoute} />;
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
