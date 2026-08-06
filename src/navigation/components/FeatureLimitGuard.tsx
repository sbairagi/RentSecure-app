import { useSubscriptionStore } from '@/store/subscriptionStore';
import { usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { API_CONFIG } from '@/services/api/endpoints';

interface FeatureLimitGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showFallback?: boolean;
  onLimitReached?: () => void;
}

export function FeatureLimitGuard({
  featureKey,
  children,
  fallback,
  redirectTo = '/(drawer)/(tabs)/subscription',
  showFallback = false,
  onLimitReached,
}: FeatureLimitGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { addOns, isLoading } = useSubscriptionStore();
  const [canUse, setCanUse] = useState<boolean>(true);
  const [checking, setChecking] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{ current: number; limit: number | 'unlimited' }>({
    current: 0,
    limit: 'unlimited',
  });

  const checkLimit = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/usage-limits/`,
        {
          headers: {
            Authorization: `Bearer ${useSubscriptionStore.getState()}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const limits = data.results || data || [];
        const featureLimit = limits.find((l: any) => l.feature_key === featureKey);

        if (featureLimit) {
          const limit = parseInt(featureLimit.limit || '-1', 10);
          const currentUsage = featureLimit.usage_count || 0;
          const allowed = limit === -1 || limit === Infinity || currentUsage < limit;

          setCanUse(allowed);
          setLimitInfo({
            current: currentUsage,
            limit: limit === -1 || limit === Infinity ? 'unlimited' : limit,
          });

          if (!allowed) {
            onLimitReached?.();
            if (pathname !== redirectTo) {
              router.replace(redirectTo);
            }
          }
        }
      }
    } catch {
      setCanUse(true);
    } finally {
      setChecking(false);
    }
  }, [featureKey, pathname, redirectTo, router, onLimitReached]);

  const hasAddOn = useMemo(
    () => addOns.some((a) => a.name === featureKey && a.is_recurring),
    [addOns, featureKey]
  );

  const effectiveCanUse = hasAddOn ? true : canUse;
  const effectiveLimitInfo = hasAddOn ? { current: 0, limit: 'unlimited' as const } : limitInfo;

  useEffect(() => {
    if (hasAddOn) {
      return;
    }

    Promise.resolve().then(() => {
      checkLimit();
    });
  }, [checkLimit, hasAddOn]);

  if (checking || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!effectiveCanUse) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    if (showFallback) {
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>Limit Reached</Text>
          <Text style={styles.fallbackText}>
            You&apos;ve reached your limit for this feature. Upgrade your plan or purchase an
            add-on.
          </Text>
          <Text style={styles.limitInfo}>
            Current: {effectiveLimitInfo.current} / {String(effectiveLimitInfo.limit)}
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
    padding: 16,
    alignItems: 'center',
  },
  fallbackContainer: {
    padding: 20,
    alignItems: 'center',
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  limitInfo: {
    fontSize: 12,
    color: '#999',
  },
});
