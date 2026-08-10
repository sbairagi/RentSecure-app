import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Card,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { PaymentStatusBadge } from '../components/PaymentStatusBadge';
import { EmptyState } from '../components/EmptyState';
import { useSubscriptionFeatureStore } from '../store/subscriptionStore';

type PaymentStatusType = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled';

export default function PaymentStatusScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { status, orderId } = useLocalSearchParams<{ status: PaymentStatusType; orderId: string }>();
  const paymentStatus = status || 'pending';
  const { refresh, clearPendingPayment } = useSubscriptionFeatureStore();

  useEffect(() => {
    if (paymentStatus === 'success') {
      clearPendingPayment();
      refresh();
    }
  }, [paymentStatus, clearPendingPayment, refresh]);

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          title: 'Payment Successful!',
          description: 'Your subscription has been activated. You now have access to all features.',
          icon: 'check-circle-outline',
        };
      case 'processing':
        return {
          title: 'Payment Processing',
          description: 'Your payment is being processed. This may take a few minutes. We will notify you once it is complete.',
          icon: 'loading',
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again or contact support.',
          icon: 'alert-circle-outline',
        };
      case 'cancelled':
        return {
          title: 'Payment Cancelled',
          description: 'The payment was cancelled. You can try again when you are ready.',
          icon: 'cancel',
        };
      case 'pending':
      default:
        return {
          title: 'Payment Pending',
          description: 'Your payment is pending confirmation. Please wait or check your payment method.',
          icon: 'clock-outline',
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['subscription:read']}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.content}>
            <Text style={[styles.icon, { color: theme.colors.onSurfaceVariant }]}>
              {statusInfo.icon}
            </Text>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              {statusInfo.title}
            </Text>
            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              {statusInfo.description}
            </Text>

            {orderId && (
              <Card style={[styles.orderCard, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                  <Text style={[styles.orderLabel, { color: theme.colors.onSurfaceVariant }]}>Order ID</Text>
                  <Text style={[styles.orderId, { color: theme.colors.onSurface }]}>
                    {orderId}
                  </Text>
                </Card.Content>
              </Card>
            )}

            <View style={styles.statusContainer}>
              <PaymentStatusBadge status={paymentStatus} />
            </View>

            <View style={styles.actionsContainer}>
              {paymentStatus === 'failed' && (
                <Button mode="contained" onPress={() => router.back()} style={styles.button}>
                  Retry Payment
                </Button>
              )}
              {paymentStatus === 'processing' && (
                <Button mode="contained" onPress={refresh} loading={false} style={styles.button}>
                  Refresh Status
                </Button>
              )}
              <Button mode="outlined" onPress={() => router.push('/(drawer)/(tabs)/subscription')} style={styles.button}>
                Go to Subscription
              </Button>
            </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  orderLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  statusContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    width: '100%',
    gap: 8,
  },
  button: {
    alignSelf: 'stretch',
  },
});
