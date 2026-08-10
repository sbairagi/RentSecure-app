import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRentRecordDetail } from '../hooks/useRentRecordDetail';
import { RentStatusBadge, PayoutStatusBadge, PaymentMethodBadge } from '../components';
import { RENT_CONSTANTS } from '../constants/rents';
import { formatCurrency, formatDate } from '../utils/rentUtils';
import { useCreateRentPayment } from '../hooks/useCreateRentPayment';

export default function RenterRentDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const createPayment = useCreateRentPayment();

  const { rent, isLoading, error, refetch } = useRentRecordDetail(Number(id));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch {
      // Error handled
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handlePayNow = useCallback(async () => {
    if (!rent) return;
    try {
      const result = await createPayment.mutateAsync({ rent_id: rent.id });
      if (result.payment_link) {
        // In a real app, open the payment link in a browser or WebView
        // For now, we'll just show a success message
        alert(`Payment initiated. Order ID: ${result.order_id}`);
      }
    } catch {
      // Error handled
    }
  }, [rent, createPayment]);

  if (isLoading && !rent) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>Loading...</Text>
        </View>
      </RouteGuard>
    );
  }

  if (error || !rent) {
    return (
      <RouteGuard requireAuth>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error || 'Rent record not found'}
          </Text>
        </View>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Rent Details
          </Text>
          <RentStatusBadge status={rent.status} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Rent Information</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Amount</Text>
              <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                {formatCurrency(rent.amount)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Due Date</Text>
              <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                {formatDate(rent.due_date)}
              </Text>
            </View>
            {rent.paid_on && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Paid On</Text>
                <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                  {formatDate(rent.paid_on)}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Payment Method</Text>
              <PaymentMethodBadge method={rent.payment_method} />
            </View>
            {rent.late_fee && parseFloat(rent.late_fee) > 0 && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Late Fee</Text>
                <Text style={[styles.value, { color: theme.colors.error }]}>
                  {formatCurrency(rent.late_fee)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {rent.payment_link && rent.status !== 'paid' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Payment</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                Pay now to complete your rent payment.
              </Text>
              <Button mode="contained" onPress={handlePayNow} loading={createPayment.isPending} style={styles.payButton}>
                Pay Now
              </Button>
            </View>
          </View>
        )}

        {rent.invoice_pdf && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Invoice</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.value, { color: theme.colors.primary }]}>
                Invoice available for download
              </Text>
            </View>
          </View>
        )}
      </View>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  payButton: {
    marginTop: 12,
    borderRadius: 12,
  },
});
