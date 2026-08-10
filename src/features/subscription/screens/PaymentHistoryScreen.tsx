import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Button,
} from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { EmptyState } from '../components/EmptyState';
import { paymentService } from '../services/paymentService';
import type { SubscriptionPayment } from '../types';
import { formatCurrency } from '../utils/formatting';
import { showMessage } from 'react-native-flash-message';

export default function PaymentHistoryScreen() {
  const theme = useTheme();
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const data = await paymentService.getHistory();
      setPayments(data);
    } catch (error) {
      showMessage({
        message: error instanceof Error ? error.message : 'Failed to load payment history',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.colors.primary;
      case 'failed':
        return theme.colors.error;
      case 'pending':
      case 'processing':
        return theme.colors.tertiary;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading payment history...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (payments.length === 0) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['subscription:read']}>
          <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                Payment History
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                View your subscription payment history
              </Text>
            </View>
            <EmptyState
              title="No Payments Yet"
              description="Your subscription payment history will appear here."
              icon="history"
            />
          </ScrollView>
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
              Payment History
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              View your subscription payment history
            </Text>
          </View>

          {payments.map((payment) => (
            <Card key={payment.id} style={[styles.paymentCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Amount
                  </Text>
                  <Text style={[styles.paymentValue, { color: theme.colors.onSurface }]}>
                    {formatCurrency(payment.amount)}
                  </Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Status
                  </Text>
                  <Text style={[styles.paymentValue, { color: getStatusColor(payment.status) }]}>
                    {payment.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Billing
                  </Text>
                  <Text style={[styles.paymentValue, { color: theme.colors.onSurface }]}>
                    {payment.billing_cycle}
                  </Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Date
                  </Text>
                  <Text style={[styles.paymentValue, { color: theme.colors.onSurface }]}>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </Text>
                </View>
                {payment.razorpay_payment_id && (
                  <View style={styles.paymentRow}>
                    <Text style={[styles.paymentLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Payment ID
                    </Text>
                    <Text style={[styles.paymentValue, { color: theme.colors.onSurface, fontFamily: 'monospace' }]}>
                      {payment.razorpay_payment_id}
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
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
  paymentCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  paymentLabel: {
    fontSize: 14,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});

