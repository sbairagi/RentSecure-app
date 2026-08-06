import { checkSubscriptionAccess, getSubscriptionStatus } from '@/navigation/utils/subscription';
import { mapBackendRole, type UserRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showFallback?: boolean;
  requiredRoles?: UserRole[];
}

const DEFAULT_SUBSCRIPTION_ROLES: UserRole[] = [
  'property_owner',
  'ca_partner',
  'admin',
  'super_admin',
];

export function SubscriptionGuard({
  children,
  fallback,
  redirectTo = '/(drawer)/(tabs)/subscription',
  showFallback = false,
  requiredRoles = DEFAULT_SUBSCRIPTION_ROLES,
}: SubscriptionGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { subscription, isLoading } = useSubscriptionStore();
  const [checking, setChecking] = useState(false);

  const currentRole: UserRole = mapBackendRole(user?.role);
  const requiresSubscription = requiredRoles.includes(currentRole);

  const checkAccess = useCallback(async () => {
    if (!isAuthenticated || !requiresSubscription) return;

    setChecking(true);
    try {
      const result = await checkSubscriptionAccess();
      if (!result.hasAccess) {
        if (pathname !== redirectTo) {
          router.replace(redirectTo);
        }
      }
    } finally {
      setChecking(false);
    }
  }, [isAuthenticated, requiresSubscription, pathname, redirectTo, router]);

  useEffect(() => {
    if (!subscription && isAuthenticated && !isLoading && requiresSubscription) {
      Promise.resolve().then(() => {
        checkAccess();
      });
    }
  }, [subscription, isAuthenticated, isLoading, requiresSubscription, checkAccess]);

  if (checking || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const status = getSubscriptionStatus(subscription);

  if (!status.isActive && requiresSubscription) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    if (showFallback) {
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>Subscription Required</Text>
          <Text style={styles.fallbackText}>
            Your subscription has expired. Please upgrade to continue.
          </Text>
        </View>
      );
    }
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fallbackText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
