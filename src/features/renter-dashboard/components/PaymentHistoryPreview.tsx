import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { RenterRentRecordSummary } from '../../types/renterDashboard';

interface PaymentHistoryPreviewProps {
  payments: RenterRentRecordSummary[];
  onViewAll?: () => void;
  onPressPayment?: (payment: RenterRentRecordSummary) => void;
}

export function PaymentHistoryPreview({ payments, onViewAll, onPressPayment }: PaymentHistoryPreviewProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push('/(drawer)/(tabs)/payments');
    }
  };

  const displayPayments = payments.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return theme.colors.primary;
      case 'overdue':
        return theme.colors.error;
      case 'pending':
        return theme.colors.tertiary;
      case 'cancelled':
        return theme.colors.outline;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={styles.header}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          Recent Payments
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.primary, fontWeight: '500' }}
          onPress={handleViewAll}
        >
          View All
        </Text>
      </View>

      <View style={styles.list}>
        {displayPayments.map((payment, index) => (
          <React.Fragment key={index}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />}
            <View
              style={styles.paymentRow}
              onTouchEnd={() => onPressPayment?.(payment)}
            >
              <View style={styles.paymentLeft}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                  {new Date(payment.due_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {payment.invoice_url ? 'Invoice available' : 'No invoice'}
                </Text>
              </View>
              <View style={styles.paymentRight}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  ₹{parseFloat(payment.amount || '0').toLocaleString('en-IN')}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(payment.payment_status)}15` },
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    style={{ color: getStatusColor(payment.payment_status), fontWeight: '600' }}
                  >
                    {payment.payment_status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  list: {
    gap: 0,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  paymentLeft: {
    flex: 1,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
});