import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useSubscriptionPlans, useCurrentSubscription } from '../hooks';
import { PlanComparisonTable } from '../components/PlanComparisonTable';
import { EmptyState } from '../components/EmptyState';

export default function PlanComparisonScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: plans, isLoading } = useSubscriptionPlans();
  const { data: subscription } = useCurrentSubscription();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading plans...</Text>
      </View>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Compare Plans
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Find the right plan for your needs
            </Text>
          </View>

          {plans && plans.length > 0 ? (
            <>
              <PlanComparisonTable plans={plans} currentPlanId={subscription?.plan?.id} />
              <View style={styles.actionsContainer}>
                <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/plans')} style={styles.button}>
                  View Plan Details
                </Button>
              </View>
            </>
          ) : (
            <EmptyState
              title="No Plans Available"
              description="Plans will be available soon. Please check back later."
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
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
