import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Chip,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useSubscriptionPlans, useCurrentSubscription, useSubscriptionStatus } from '../hooks';
import { PlanCard } from '../components/PlanCard';
import { EmptyState } from '../components/EmptyState';
import { subscriptionService } from '../services/subscriptionService';

export default function DowngradePlanScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: plans, isLoading } = useSubscriptionPlans();
  const { data: subscription } = useCurrentSubscription();
  const { planName } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading plans...</Text>
      </View>
    );
  }

  const currentPlanName = planName || subscription?.plan?.name || 'free';
  const availablePlans = plans?.filter(p => subscriptionService.canDowngrade(currentPlanName, p.name)) ?? [];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:write']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Downgrade Plan
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Current plan: {currentPlanName.charAt(0).toUpperCase() + currentPlanName.slice(1)}
            </Text>
            <Text style={[styles.warning, { color: theme.colors.error }]}>
              Downgrading may reduce your feature limits.
            </Text>
          </View>

          {availablePlans.length > 0 ? (
            availablePlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle="monthly"
                onPress={() => router.push('/(drawer)/(tabs)/subscription/plan-details' as any)}
                onDowngrade={() => router.push('/(drawer)/(tabs)/subscription/purchase-confirmation' as any)}
              />
            ))
          ) : (
            <EmptyState
              title="No Downgrades Available"
              description="You are already on the lowest available plan."
              actionLabel="Back to Dashboard"
              onAction={() => router.push('/(drawer)/(tabs)/dashboard')}
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
  warning: {
    fontSize: 13,
    marginTop: 8,
  },
});
