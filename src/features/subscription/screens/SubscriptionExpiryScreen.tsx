import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Card,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useSubscriptionStatus, useSubscriptionPlans } from '../hooks';
import { EmptyState } from '../components/EmptyState';
import { getPlanDisplayName, formatDate, formatCurrency } from '../utils/formatting';

export default function SubscriptionExpiryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isExpired, subscription, daysRemaining, isInGracePeriod } = useSubscriptionStatus();
  const { data: plans } = useSubscriptionPlans();

  if (!isExpired) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                Subscription Active
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Your subscription is currently active.
              </Text>
            </View>

            {subscription && (
              <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                  <Text style={[styles.planName, { color: theme.colors.onSurface }]}>
                    {subscription.plan?.name ? getPlanDisplayName(subscription.plan.name) : 'Free'}
                  </Text>
                  <Text style={[styles.expiryText, { color: theme.colors.onSurfaceVariant }]}>
                    Expires: {formatDate(subscription.end_date)}
                  </Text>
                  <Text style={[styles.daysText, { color: theme.colors.primary }]}>
                    {daysRemaining !== null ? `${daysRemaining} days remaining` : 'N/A'}
                  </Text>
                </Card.Content>
              </Card>
            )}

            <View style={styles.actionsContainer}>
              <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/upgrade')} style={styles.button}>
                Upgrade Plan
              </Button>
            </View>
          </ScrollView>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const currentPlanName = subscription?.plan?.name || 'free';
  const availablePlans = plans?.filter(p => p.name !== currentPlanName && p.is_active) ?? [];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.error }]}>
              Subscription Expired
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {isInGracePeriod 
                ? 'You are in the grace period. Some features may be limited.'
                : 'Your subscription has expired. Please renew to regain full access.'}
            </Text>
          </View>

          {subscription && (
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Expired Plan Details
                </Text>
                <Text style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}>
                  Plan: {subscription.plan?.name ? getPlanDisplayName(subscription.plan.name) : 'Free'}
                </Text>
                <Text style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}>
                  Expired: {formatDate(subscription.end_date)}
                </Text>
                <Text style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}>
                  Status: Expired
                </Text>
              </Card.Content>
            </Card>
          )}

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Available Plans
              </Text>
              {availablePlans.map(plan => (
                <Button
                  key={plan.id}
                  mode="outlined"
                  onPress={() => router.push(`/(drawer)/(tabs)/subscription/plan-details?id=${plan.id}`)}
                  style={styles.planButton}
                >
                  {getPlanDisplayName(plan.name)} — {formatCurrency(plan.monthly_price)}/mo
                </Button>
              ))}
            </Card.Content>
          </Card>

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/renew')} style={styles.button}>
              Renew Subscription
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    marginBottom: 6,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  expiryText: {
    fontSize: 14,
    marginBottom: 4,
  },
  daysText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  planButton: {
    marginVertical: 4,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  button: {
    alignSelf: 'stretch',
  },
});
