import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import type { Payout } from '../types/payouts';
import { PAYMENT_CONSTANTS } from '../constants/payments';
import { formatCurrency, formatDate } from '../utils/paymentUtils';

interface PayoutCardProps {
  payout: Payout;
  onPress?: () => void;
  onRetry?: () => void;
}

export const PayoutCard: React.FC<PayoutCardProps> = ({ payout, onPress, onRetry }) => {
  const theme = useTheme();
  const config = PAYMENT_CONSTANTS.PAYOUT_STATUS_CONFIG[payout.status as keyof typeof PAYMENT_CONSTANTS.PAYOUT_STATUS_CONFIG] || PAYMENT_CONSTANTS.PAYOUT_STATUS_CONFIG.pending;
  const label = PAYMENT_CONSTANTS.PAYOUT_STATUS_LABELS[payout.status as keyof typeof PAYMENT_CONSTANTS.PAYOUT_STATUS_LABELS] || payout.status;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.renterName, { color: theme.colors.onSurface }]}>
            {payout.renter_name}
          </Text>
          <Text style={[styles.unitName, { color: theme.colors.onSurfaceVariant }]}>
            {payout.building_name} • {payout.unit_name}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.backgroundColor }]}>
          <Text style={[styles.statusText, { color: config.color }]}>
            {label}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.amount, { color: theme.colors.onSurface }]}>
          {formatCurrency(payout.amount)}
        </Text>
        {payout.transaction_id && (
          <Text style={[styles.txnId, { color: theme.colors.onSurfaceVariant }]}>
            Txn ID: {payout.transaction_id}
          </Text>
        )}
        {payout.failure_reason && (
          <Text style={[styles.failureReason, { color: theme.colors.error }]}>
            Reason: {payout.failure_reason}
          </Text>
        )}
        <Text style={[styles.initiatedAt, { color: theme.colors.onSurfaceVariant }]}>
          Initiated: {formatDate(payout.initiated_at)}
        </Text>
        {payout.completed_at && (
          <Text style={[styles.completedAt, { color: theme.colors.onSurfaceVariant }]}>
            Completed: {formatDate(payout.completed_at)}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {payout.status === 'failed' && onRetry && (
          <IconButton
            icon="refresh"
            size={18}
            onPress={onRetry}
            iconColor={theme.colors.primary}
          />
        )}
        {onPress && (
          <IconButton
            icon="chevron-right"
            size={18}
            onPress={onPress}
            iconColor={theme.colors.onSurfaceVariant}
          />
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
  body: {
    gap: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  txnId: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  failureReason: {
    fontSize: 12,
  },
  initiatedAt: {
    fontSize: 12,
  },
  completedAt: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 8,
  },
});
