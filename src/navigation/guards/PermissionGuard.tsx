import type { Permission } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hasPermission } from '@/navigation/utils/permissions';

interface PermissionGuardProps {
  permissions: Permission | Permission[];
  mode?: 'all' | 'any';
  fallback?: React.ReactNode;
  redirectTo?: string;
  showFallback?: boolean;
  children: React.ReactNode;
}

export function PermissionGuard({
  permissions,
  mode = 'any',
  fallback,
  redirectTo = '/(drawer)/(tabs)/dashboard',
  showFallback = false,
  children,
}: PermissionGuardProps) {
  const router = useRouter();
  const { role } = useAuthStore();
  const currentRole = role || 'user';

  const requiredPerms = Array.isArray(permissions) ? permissions : [permissions];

  let hasAccess: boolean;
  if (mode === 'all') {
    hasAccess = requiredPerms.every((perm) => hasPermission(currentRole, perm));
  } else {
    hasAccess = requiredPerms.some((perm) => hasPermission(currentRole, perm));
  }

  useEffect(() => {
    if (!hasAccess) {
      router.replace(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);

  if (!hasAccess) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    if (showFallback) {
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>
            You don&apos;t have permission to access this section.
          </Text>
        </View>
      );
    }
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
