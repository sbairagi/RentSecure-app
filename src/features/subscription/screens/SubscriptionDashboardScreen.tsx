import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { SubscriptionGuardWrapper } from '@/features/subscription/components/SubscriptionGuardWrapper';
import {
  useSubscriptionStatus,
  useEffectiveLimits,
  useAddOns,
  useRefreshSubscription,
} from '../hooks';
import { CurrentPlanCard } from '../components/CurrentPlanCard';
import { FeatureLimitRow } from '../components/FeatureLimitRow';
import { AddOnCard } from '../components/AddOnCard';
import { EmptyState } from '../components/EmptyState';
import { FEATURE_LABELS } from '../types/limits';
import { useTranslation } from 'react-i18next';

export default function SubscriptionDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { isExpired, subscription, planName } = useSubscriptionStatus();
  const { data: effectiveLimits } = useEffectiveLimits();
  const { data: addOns } = useAddOns();
  const refresh = useRefreshSubscription();

  React.useEffect(() => {
    refresh();
  }, []);

  if (isExpired) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <SubscriptionGuardWrapper
            fallback={
              <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <EmptyState
                  title="Subscription Expired"
                  description="Your subscription has expired. Please renew to continue accessing all features."
                  actionLabel="Renew Subscription"
                  onAction={() => router.push('/(drawer)/(tabs)/subscription/renew')}
                />
              </View>
            }
          >
            <View />
          </SubscriptionGuardWrapper>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const numericFeatures = effectiveLimits?.filter(l => !(FEATURE_LABELS as Record<string, string>)[l.featureKey]?.includes('Notification')) ?? [];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Subscription Dashboard
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Manage your plan and usage
            </Text>
          </View>

          {subscription && (
            <CurrentPlanCard
              subscription={subscription}
              onUpgrade={() => router.push('/(drawer)/(tabs)/subscription/upgrade')}
              onRenew={() => router.push('/(drawer)/(tabs)/subscription/renew')}
              onCancel={() => router.push('/(drawer)/(tabs)/subscription/cancel')}
            />
          )}

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Usage Overview
              </Text>
              <Divider style={styles.divider} />
              {effectiveLimits && effectiveLimits.length > 0 ? (
                effectiveLimits.map(limit => (
                  <FeatureLimitRow
                    key={limit.featureKey}
                    limit={limit}
                    onPress={() => router.push('/(drawer)/(tabs)/subscription/add-ons')}
                  />
                ))
              ) : (
                <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', padding: 16 }}>
                  Loading usage data...
                </Text>
              )}
            </Card.Content>
          </Card>

          {addOns && addOns.length > 0 && (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Active Add-ons
                  </Text>
                  <Button mode="text" onPress={() => router.push('/(drawer)/(tabs)/subscription/add-ons')}>
                    View All
                  </Button>
                </View>
                <Divider style={styles.divider} />
                {addOns.slice(0, 3).map(addOn => (
                  <AddOnCard key={addOn.id} addOn={addOn} />
                ))}
              </Card.Content>
            </Card>
          )}

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/plans')} style={styles.actionButton}>
              View All Plans
            </Button>
            <Button mode="outlined" onPress={() => router.push('/(drawer)/(tabs)/subscription/usage')} style={styles.actionButton}>
              Detailed Usage
            </Button>
          </View>
        </ScrollView>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionButton: {
    flex: 1,
  },
});
