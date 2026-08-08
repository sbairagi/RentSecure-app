import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  RadioButton,
  Divider,
  Surface,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useSubscriptionPlans, useCurrentSubscription } from '../hooks';
import { PlanCard } from '../components/PlanCard';
import { EmptyState } from '../components/EmptyState';
import { paymentService } from '../services/paymentService';
import { showMessage } from 'react-native-flash-message';
import { formatCurrency } from '../utils/formatting';

type BillingCycle = 'monthly' | 'yearly';

export default function PurchaseConfirmationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { data: plans, isLoading } = useSubscriptionPlans();
  const { data: subscription } = useCurrentSubscription();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = plans?.find(p => String(p.id) === planId);
  const currentPlanName = subscription?.plan?.name || 'free';

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:write']}>
          <EmptyState
            title="Plan Not Found"
            description="The selected plan could not be found."
            actionLabel="Back to Plans"
            onAction={() => router.back()}
          />
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const price = billingCycle === 'monthly' ? plan.monthly_price : plan.yearly_price;

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      // NOTE: Subscription payment API does not exist on backend yet
      // When backend adds the API, this will work:
      // const order = await paymentService.createOrder({
      //   planId: plan.id,
      //   billingCycle,
      // });
      // Then open Razorpay checkout with order.order_id
      
      showMessage({
        message: 'Payment integration coming soon. Backend subscription payment API is required.',
        type: 'info',
      });
    } catch (error) {
      showMessage({
        message: error instanceof Error ? error.message : 'Failed to process payment',
        type: 'danger',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:write']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Confirm Purchase
            </Text>
          </View>

          <PlanCard plan={plan} billingCycle={billingCycle} />

          <Surface style={[styles.billingCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Billing Cycle
            </Text>
            <RadioButton.Group onValueChange={value => setBillingCycle(value as BillingCycle)} value={billingCycle}>
              <View style={styles.radioRow}>
                <RadioButton value="monthly" />
                <View style={styles.radioLabel}>
                  <Text style={{ color: theme.colors.onSurface }}>Monthly</Text>
                  <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                    {formatCurrency(plan.monthly_price)}/mo
                  </Text>
                </View>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="yearly" />
                <View style={styles.radioLabel}>
                  <Text style={{ color: theme.colors.onSurface }}>Yearly</Text>
                  <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                    {formatCurrency(plan.yearly_price)}/yr
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </Surface>

          <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Order Summary</Text>
            <Divider style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Plan</Text>
              <Text style={{ color: theme.colors.onSurface }}>{plan.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Billing</Text>
              <Text style={{ color: theme.colors.onSurface }}>{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Total</Text>
              <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
                {formatCurrency(price)}
              </Text>
            </View>
          </Surface>

          <View style={styles.actionsContainer}>
            <Button mode="contained" onPress={handlePurchase} loading={isProcessing} disabled={isProcessing} style={styles.button}>
              Proceed to Payment
            </Button>
            <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
              Cancel
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
  },
  billingCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
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
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  divider: {
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
  },
  button: {
    alignSelf: 'stretch',
  },
});
