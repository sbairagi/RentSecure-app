import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useCurrentSubscription, useSubscriptionStatus, useRefreshSubscription } from '../hooks';
import { CurrentPlanCard } from '../components/CurrentPlanCard';
import { EmptyState } from '../components/EmptyState';

export default function CurrentPlanScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: subscription, isLoading } = useCurrentSubscription();
  const { isExpired } = useSubscriptionStatus();
  const refresh = useRefreshSubscription();

  React.useEffect(() => {
    refresh();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!subscription) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <EmptyState
            title="No Active Subscription"
            description="You don't have an active subscription yet. Choose a plan to get started."
            actionLabel="View Plans"
            onAction={() => router.push('/(drawer)/(tabs)/subscription/plans')}
          />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Current Plan
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Your active subscription details
            </Text>
          </View>

          {isExpired ? (
            <EmptyState
              title="Subscription Expired"
              description="Your subscription has expired. Renew now to regain access to all features."
              actionLabel="Renew Now"
              onAction={() => router.push('/(drawer)/(tabs)/subscription/renew')}
            />
          ) : (
            <CurrentPlanCard
              subscription={subscription}
              onUpgrade={() => router.push('/(drawer)/(tabs)/subscription/upgrade')}
              onRenew={() => router.push('/(drawer)/(tabs)/subscription/renew')}
              onCancel={() => router.push('/(drawer)/(tabs)/subscription/cancel')}
            />
          )}
        </ScrollView>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
