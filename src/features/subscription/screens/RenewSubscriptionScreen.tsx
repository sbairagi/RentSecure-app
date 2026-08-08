import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Card,
  RadioButton,
  Divider,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useSubscriptionPlans, useCurrentSubscription, useSubscriptionStatus } from '../hooks';
import { PlanCard } from '../components/PlanCard';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency } from '../utils/formatting';

type BillingCycle = 'monthly' | 'yearly';

export default function RenewSubscriptionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: subscription } = useCurrentSubscription();
  const { isExpired } = useSubscriptionStatus();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlanName = subscription?.plan?.name || 'free';
  const currentPlan = plans?.find(p => p.name === currentPlanName);
  const selectedPlan = planId ? plans?.find(p => String(p.id) === planId) : currentPlan;

  if (plansLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!isExpired) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:write']}>
          <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                Renew Subscription
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Your subscription is still active. You can renew early or wait until expiry.
              </Text>
            </View>

            {selectedPlan && (
              <PlanCard plan={selectedPlan} billingCycle={billingCycle} />
            )}

            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Billing Cycle</Text>
                <RadioButton.Group onValueChange={value => setBillingCycle(value as BillingCycle)} value={billingCycle}>
                  <View style={styles.radioRow}>
                    <RadioButton value="monthly" />
                    <View style={styles.radioLabel}>
                      <Text style={{ color: theme.colors.onSurface }}>Monthly</Text>
                      <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                        {selectedPlan ? formatCurrency(selectedPlan.monthly_price) : 'N/A'}/mo
                      </Text>
                    </View>
                  </View>
                  <View style={styles.radioRow}>
                    <RadioButton value="yearly" />
                    <View style={styles.radioLabel}>
                      <Text style={{ color: theme.colors.onSurface }}>Yearly</Text>
                      <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                        {selectedPlan ? formatCurrency(selectedPlan.yearly_price) : 'N/A'}/yr
                      </Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </Card.Content>
            </Card>

            <View style={styles.actionsContainer}>
              <Button mode="contained" onPress={() => {
                router.push(`/(drawer)/(tabs)/subscription/purchase-confirmation?planId=${selectedPlan?.id}`);
              }} style={styles.button}>
                Proceed to Payment
              </Button>
            </View>
          </ScrollView>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:write']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.error }]}>
              Renew Subscription
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Your subscription has expired. Choose a plan to renew.
            </Text>
          </View>

          {selectedPlan ? (
            <PlanCard plan={selectedPlan} billingCycle={billingCycle} />
          ) : (
            <EmptyState
              title="Select a Plan"
              description="Please select a plan to renew your subscription."
              actionLabel="View Plans"
              onAction={() => router.push('/(drawer)/(tabs)/subscription/plans')}
            />
          )}

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Billing Cycle</Text>
              <RadioButton.Group onValueChange={value => setBillingCycle(value as BillingCycle)} value={billingCycle}>
                <View style={styles.radioRow}>
                  <RadioButton value="monthly" />
                  <View style={styles.radioLabel}>
                    <Text style={{ color: theme.colors.onSurface }}>Monthly</Text>
                    <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                      {selectedPlan ? formatCurrency(selectedPlan.monthly_price) : 'N/A'}/mo
                    </Text>
                  </View>
                </View>
                <View style={styles.radioRow}>
                  <RadioButton value="yearly" />
                  <View style={styles.radioLabel}>
                    <Text style={{ color: theme.colors.onSurface }}>Yearly</Text>
                    <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                      {selectedPlan ? formatCurrency(selectedPlan.yearly_price) : 'N/A'}/yr
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </Card.Content>
          </Card>

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={() => {
              if (selectedPlan) {
                router.push(`/(drawer)/(tabs)/subscription/purchase-confirmation?planId=${selectedPlan.id}`);
              }
            }} disabled={!selectedPlan} style={styles.button}>
              Proceed to Payment
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioLabel: {
    marginLeft: 8,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  button: {
    alignSelf: 'stretch',
  },
});
