import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import {
  useAddOns,
  useSubscriptionPlans,
  useUserSubscription,
  useUsageLimits,
} from '../hooks';

export default function SubscriptionSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: subscription, isLoading: subLoading } = useUserSubscription();
  const { data: addOns } = useAddOns();
  const { data: usageLimits } = useUsageLimits();

  const isLoading = plansLoading || subLoading;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>
          Loading subscription...
        </Text>
      </View>
    );
  }

  const currentPlan = subscription?.plan;
  const isActive = subscription?.is_active ?? false;

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Subscription
          </Text>
        </View>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.planName, { color: theme.colors.onSurface }]}>
              {currentPlan?.name ? currentPlan.name.charAt(0).toUpperCase() + currentPlan.name.slice(1) : 'Free'}
            </Text>
            <Text style={[styles.status, { color: isActive ? theme.colors.primary : theme.colors.error }]}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
            {subscription?.end_date ? (
              <Text style={[styles.expiry, { color: theme.colors.onSurfaceVariant }]}>
                Expires: {subscription.end_date}
              </Text>
            ) : null}
            {currentPlan?.monthly_price ? (
              <Text style={[styles.price, { color: theme.colors.onSurfaceVariant }]}>
                ₹{currentPlan.monthly_price}/month
              </Text>
            ) : null}
          </Card.Content>
        </Card>

        {subscription?.start_date ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Subscription Details
              </Text>
              <Text style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}>
                Started: {subscription.start_date}
              </Text>
              <Text style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}>
                Type: {subscription.is_yearly ? 'Yearly' : 'Monthly'}
              </Text>
              <Text style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}>
                Rent Reminders: {subscription.rent_reminder_days_before} days before
              </Text>
              <Text style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}>
                Tax Reminders: {subscription.tax_reminder_days_before} days before
              </Text>
            </Card.Content>
          </Card>
        ) : null}

        {usageLimits && usageLimits.length > 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Usage Limits
              </Text>
              {usageLimits.map((limit) => (
                <Text
                  key={limit.id}
                  style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}
                >
                  {limit.feature_key.replace(/_/g, ' ')}: {limit.usage_count}
                </Text>
              ))}
            </Card.Content>
          </Card>
        ) : null}

        {addOns && addOns.length > 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Add-ons
              </Text>
              {addOns.map((addOn) => (
                <Text
                  key={addOn.id}
                  style={[styles.detail, { color: theme.colors.onSurfaceVariant }]}
                >
                  {addOn.name.replace(/_/g, ' ')}: ₹{addOn.amount}
                  {addOn.is_recurring ? ' (recurring)' : ''}
                </Text>
              ))}
            </Card.Content>
          </Card>
        ) : null}

        {plans && plans.length > 0 ? (
          <View style={styles.plansContainer}>
            <Text style={[styles.plansTitle, { color: theme.colors.onSurface }]}>
              Available Plans
            </Text>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                style={[
                  styles.planCard,
                  { backgroundColor: theme.colors.surface },
                  currentPlan?.id === plan.id && { borderColor: theme.colors.primary, borderWidth: 2 },
                ]}
              >
                <Card.Content>
                  <Text style={[styles.planName, { color: theme.colors.onSurface }]}>
                    {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                  </Text>
                  <Text style={[styles.price, { color: theme.colors.onSurfaceVariant }]}>
                    ₹{plan.monthly_price}/mo • ₹{plan.yearly_price}/yr
                  </Text>
                  <Text style={[styles.features, { color: theme.colors.onSurfaceVariant }]}>
                    {plan.features}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : null}
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
  },
  status: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  expiry: {
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  features: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  plansContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  planCard: {
    borderRadius: 12,
    marginBottom: 12,
  },
});
