import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import type { Payment } from '../types/payments';
import { PAYMENT_CONSTANTS } from '../constants/payments';
import { formatCurrency, formatDate } from '../utils/paymentUtils';

interface PaymentCardProps {
  payment: Payment;
  onPress?: () => void;
  onRetry?: () => void;
  onRemind?: () => void;
  showActions?: boolean;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onPress,
  onRetry,
  onRemind,
  showActions = true,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/(drawer)/(tabs)/payments/${payment.id}` as any);
    }
  };

  const daysOverdue = payment.status === 'overdue'
    ? Math.ceil((Date.now() - new Date(payment.due_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const statusConfig = PAYMENT_CONSTANTS.STATUS_CONFIG[payment.status as keyof typeof PAYMENT_CONSTANTS.STATUS_CONFIG] || PAYMENT_CONSTANTS.STATUS_CONFIG.pending;
  const statusLabel = PAYMENT_CONSTANTS.STATUS_LABELS[payment.status as keyof typeof PAYMENT_CONSTANTS.STATUS_LABELS] || payment.status;
  const methodConfig = PAYMENT_CONSTANTS.METHOD_CONFIG[payment.payment_method as keyof typeof PAYMENT_CONSTANTS.METHOD_CONFIG] || PAYMENT_CONSTANTS.METHOD_CONFIG.other;
  const methodLabel = PAYMENT_CONSTANTS.METHOD_LABELS[payment.payment_method as keyof typeof PAYMENT_CONSTANTS.METHOD_LABELS] || payment.payment_method;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.renterName, { color: theme.colors.onSurface }]}>
            {payment.renter_name}
          </Text>
          <Text style={[styles.unitName, { color: theme.colors.onSurfaceVariant }]}>
            {payment.building_name} • {payment.unit_name}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.amountRow}>
          <Text style={[styles.amount, { color: theme.colors.onSurface }]}>
            {formatCurrency(payment.total_amount || payment.amount)}
          </Text>
          {payment.late_fee && parseFloat(payment.late_fee) > 0 && (
            <Text style={[styles.lateFee, { color: theme.colors.error }]}>
              Late Fee: {formatCurrency(payment.late_fee)}
            </Text>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.dueDate, { color: theme.colors.onSurfaceVariant }]}>
            Due: {formatDate(payment.due_date)}
          </Text>
          <View style={[styles.methodBadge, { backgroundColor: `${methodConfig.color}15` }]}>
            <Text style={[styles.methodText, { color: methodConfig.color }]}>
              {methodLabel}
            </Text>
          </View>
        </View>

        {daysOverdue > 0 && (
          <View style={[styles.overdueBadge, { backgroundColor: `${theme.colors.error}15` }]}>
            <Text style={[styles.overdueText, { color: theme.colors.error }]}>
              {daysOverdue} days overdue
            </Text>
          </View>
        )}

        {showActions && (
          <View style={styles.actions}>
            {payment.status === 'failed' && onRetry && (
              <IconButton
                icon="refresh"
                size={18}
                onPress={onRetry}
                iconColor={theme.colors.primary}
              />
            )}
            {payment.status === 'pending' && onRemind && (
              <IconButton
                icon="bell-outline"
                size={18}
                onPress={onRemind}
                iconColor={theme.colors.primary}
              />
            )}
            <IconButton
              icon="chevron-right"
              size={18}
              onPress={handlePress}
              iconColor={theme.colors.onSurfaceVariant}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  renterName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  unitName: {
    fontSize: 13,
  },
  body: {
    gap: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  lateFee: {
    fontSize: 13,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 13,
  },
  methodBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  overdueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
});
