import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import type { RentRecordCardProps } from '../types';

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid: '#16a34a',
  pending: '#d97706',
  overdue: '#dc2626',
  partial: '#9333ea',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
  partial: 'Partial',
};

export const RentRecordCard: React.FC<RentRecordCardProps> = ({ record }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.card }]}>
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text style={[styles.month, { color: theme.text }]}>
              {new Date(record.due_date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text style={[styles.amount, { color: theme.text }]}>₹{record.amount}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: (PAYMENT_STATUS_COLORS[record.status] || '#6b7280') + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: PAYMENT_STATUS_COLORS[record.status] || '#6b7280' },
              ]}
            >
              {PAYMENT_STATUS_LABELS[record.status] || record.status}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          {record.payment_method && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: theme.subText }]}>Method:</Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {record.payment_method.replace(/_/g, ' ')}
              </Text>
            </View>
          )}
          {record.paid_on && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: theme.subText }]}>Paid On:</Text>
              <Text style={[styles.value, { color: theme.text }]}>
                {new Date(record.paid_on).toLocaleDateString()}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.subText }]}>Due:</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {new Date(record.due_date).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  month: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
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
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
});
