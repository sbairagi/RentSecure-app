import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import type { ExtraChargeCardProps } from '../types';

const CHARGE_STATUS_COLORS: Record<string, string> = {
  pending: '#d97706',
  paid: '#16a34a',
  overdue: '#dc2626',
  waived: '#6b7280',
};

const CHARGE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
  waived: 'Waived',
};

export const ExtraChargeCard: React.FC<ExtraChargeCardProps> = ({ charge }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.card }]}>
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text style={[styles.name, { color: theme.text }]}>{charge.name}</Text>
            {charge.description && (
              <Text style={[styles.description, { color: theme.subText }]}>
                {charge.description}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: (CHARGE_STATUS_COLORS[charge.status] || '#6b7280') + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: CHARGE_STATUS_COLORS[charge.status] || '#6b7280' },
              ]}
            >
              {CHARGE_STATUS_LABELS[charge.status] || charge.status}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.subText }]}>Amount:</Text>
            <Text style={[styles.value, { color: theme.text }]}>₹{charge.amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.subText }]}>Due:</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {new Date(charge.due_date).toLocaleDateString()}
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
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
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
