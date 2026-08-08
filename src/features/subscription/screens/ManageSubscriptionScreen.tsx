import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Card,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useCurrentSubscription, useSubscriptionStatus, useSubscriptionPlans } from '../hooks';
import { EmptyState } from '../components/EmptyState';
import { getPlanDisplayName, formatDate } from '../utils/formatting';
import { subscriptionService } from '../services/subscriptionService';

export default function ManageSubscriptionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: subscription, isLoading } = useCurrentSubscription();
  const { isExpired, planName } = useSubscriptionStatus();
  const { data: plans } = useSubscriptionPlans();

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
        <PermissionGuard permissions={['subscription:write']}>
          <EmptyState
            title="No Subscription"
            description="You don't have an active subscription to manage."
            actionLabel="View Plans"
            onAction={() => router.push('/(drawer)/(tabs)/subscription/plans')}
          />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const currentPlanName = planName || subscription.plan?.name || 'free';
  const currentPlan = plans?.find(p => p.name === currentPlanName);
  const canUpgrade = currentPlan ? plans?.some(p => subscriptionService.canUpgrade(currentPlanName, p.name)) : false;
  const canDowngrade = currentPlan ? plans?.some(p => subscriptionService.canDowngrade(currentPlanName, p.name)) : false;

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:write']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Manage Subscription
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Update, upgrade, or cancel your plan
            </Text>
          </View>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Current Plan
              </Text>
              <Divider style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Plan</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {subscription.plan?.name ? getPlanDisplayName(subscription.plan.name) : 'Free'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Status</Text>
                <Text style={[styles.detailValue, { color: isExpired ? theme.colors.error : theme.colors.primary }]}>
                  {isExpired ? 'Expired' : 'Active'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Start Date</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {formatDate(subscription.start_date)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Expiry Date</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {formatDate(subscription.end_date)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Billing</Text>
                <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                  {subscription.is_yearly ? 'Yearly' : 'Monthly'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Actions
              </Text>
              <Divider style={styles.divider} />
              <View style={styles.actionsContainer}>
                {canUpgrade && (
                  <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/upgrade')} style={styles.actionButton}>
                    Upgrade Plan
                  </Button>
                )}
                {canDowngrade && (
                  <Button mode="outlined" onPress={() => router.push('/(drawer)/(tabs)/subscription/downgrade')} style={styles.actionButton}>
                    Downgrade Plan
                  </Button>
                )}
                <Button mode="contained" onPress={() => router.push('/(drawer)/(tabs)/subscription/renew')} style={styles.actionButton}>
                  Renew Subscription
                </Button>
                <Button mode="text" textColor={theme.colors.error} onPress={() => router.push('/(drawer)/(tabs)/subscription/cancel')} style={styles.actionButton}>
                  Cancel Subscription
                </Button>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Quick Links
              </Text>
              <Divider style={styles.divider} />
              <Button mode="text" onPress={() => router.push('/(drawer)/(tabs)/subscription/plans')} style={styles.linkButton}>
                View All Plans
              </Button>
              <Button mode="text" onPress={() => router.push('/(drawer)/(tabs)/subscription/add-ons')} style={styles.linkButton}>
                Manage Add-ons
              </Button>
              <Button mode="text" onPress={() => router.push('/(drawer)/(tabs)/subscription/usage')} style={styles.linkButton}>
                View Usage
              </Button>
              <Button mode="text" onPress={() => router.push('/(drawer)/(tabs)/subscription/invoices')} style={styles.linkButton}>
                Invoices
              </Button>
            </Card.Content>
          </Card>
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
  divider: {
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 8,
  },
  actionButton: {
    alignSelf: 'stretch',
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
});
