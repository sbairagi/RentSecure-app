import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import type { RentRecord } from '../types/rents';
import { RENT_CONSTANTS } from '../constants/rents';
import { formatCurrency, formatDate } from '../utils/rentUtils';

const STATUS_COLORS: Record<string, string> = {
  pending: '#D97706',
  paid: '#059669',
  overdue: '#DC2626',
  cancelled: '#6B7280',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

const PAYOUT_COLORS: Record<string, string> = {
  PENDING: '#D97706',
  SUCCESS: '#059669',
  FAILED: '#DC2626',
};

const PAYOUT_LABELS: Record<string, string> = {
  PENDING: 'Payout Pending',
  SUCCESS: 'Payout Complete',
  FAILED: 'Payout Failed',
};

interface RentCardProps {
  rent: RentRecord;
  onPress?: () => void;
  onRetryPayout?: () => void;
  onResendConfirmation?: () => void;
  showActions?: boolean;
}

export const RentCard: React.FC<RentCardProps> = ({
  rent,
  onPress,
  onRetryPayout,
  onResendConfirmation,
  showActions = true,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const daysOverdue = rent.status === 'overdue'
    ? Math.ceil((Date.now() - new Date(rent.due_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const statusColor = STATUS_COLORS[rent.status] || '#6B7280';
  const statusLabel = STATUS_LABELS[rent.status] || rent.status;
  const methodConfig = RENT_CONSTANTS.METHOD_CONFIG[rent.payment_method as keyof typeof RENT_CONSTANTS.METHOD_CONFIG] || RENT_CONSTANTS.METHOD_CONFIG.other;
  const methodLabel = RENT_CONSTANTS.METHOD_LABELS[rent.payment_method as keyof typeof RENT_CONSTANTS.METHOD_LABELS] || rent.payment_method;
  const payoutColor = PAYOUT_COLORS[rent.payout_status] || '#6B7280';
  const payoutLabel = PAYOUT_LABELS[rent.payout_status] || rent.payout_status;

  return (
    <Card style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.renterName, { color: theme.text }]}>
              {rent.renter_name || `Renter #${rent.renter || 'N/A'}`}
            </Text>
            <Text style={[styles.unitName, { color: theme.subText }]}>
              {rent.building_name ? `${rent.building_name} • ` : ''}{rent.unit_name || `Unit #${rent.unit}`}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.amountRow}>
            <Text style={[styles.amount, { color: theme.text }]}>
              {formatCurrency(rent.amount)}
            </Text>
            {rent.late_fee && parseFloat(rent.late_fee) > 0 && (
              <Text style={[styles.lateFee, { color: theme.error }]}>
                Late Fee: {formatCurrency(rent.late_fee)}
              </Text>
            )}
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.dueDate, { color: theme.subText }]}>
              Due: {formatDate(rent.due_date)}
            </Text>
            <View style={[styles.methodBadge, { backgroundColor: `${methodConfig.color}15` }]}>
              <Text style={[styles.methodText, { color: methodConfig.color }]}>
                {methodLabel}
              </Text>
            </View>
          </View>

          {rent.paid_on && (
            <View style={styles.paidRow}>
              <Text style={[styles.paidText, { color: theme.subText }]}>
                Paid on: {formatDate(rent.paid_on)}
              </Text>
              {rent.transaction_id && (
                <Text style={[styles.transactionText, { color: theme.subText }]}>
                  Txn: {rent.transaction_id}
                </Text>
              )}
            </View>
          )}

          <View style={styles.payoutRow}>
            <Text style={[styles.payoutLabel, { color: theme.subText }]}>
              Payout:
            </Text>
            <View style={[styles.payoutBadge, { backgroundColor: payoutColor + '20' }]}>
              <Text style={[styles.payoutText, { color: payoutColor }]}>
                {payoutLabel}
              </Text>
            </View>
          </View>

          {daysOverdue > 0 && (
            <View style={[styles.overdueBadge, { backgroundColor: `${theme.error}15` }]}>
              <Text style={[styles.overdueText, { color: theme.error }]}>
                {daysOverdue} days overdue
              </Text>
            </View>
          )}

          {rent.payment_link && (
            <View style={styles.linkRow}>
              <Text style={[styles.linkLabel, { color: theme.subText }]}>
                Payment Link:
              </Text>
              <Text style={[styles.linkText, { color: theme.primary }]} numberOfLines={1}>
                {rent.payment_link}
              </Text>
            </View>
          )}

          {showActions && (
            <View style={styles.actions}>
              {rent.payout_status === 'FAILED' && onRetryPayout && (
                <Text style={[styles.actionText, { color: theme.primary }]} onPress={onRetryPayout}>
                  Retry Payout
                </Text>
              )}
              {rent.status === 'paid' && onResendConfirmation && (
                <Text style={[styles.actionText, { color: theme.primary }]} onPress={onResendConfirmation}>
                  Resend Confirmation
                </Text>
              )}
              <Text style={[styles.actionText, { color: theme.primary }]} onPress={handlePress}>
                View Details
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
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
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
  paidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidText: {
    fontSize: 13,
  },
  transactionText: {
    fontSize: 12,
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payoutLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  payoutBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payoutText: {
    fontSize: 12,
    fontWeight: '600',
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
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  linkText: {
    fontSize: 12,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
