import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useDesignSystemTheme } from '../theme';
import { colors, radius, spacing } from '../tokens';
import { Card } from './Card';

export interface InvoiceCardProps {
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  tenant?: string;
  property?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const statusConfig = {
  paid: { color: colors.success[500], bg: colors.success[100], label: 'Paid' },
  pending: { color: colors.warning[500], bg: colors.warning[100], label: 'Pending' },
  overdue: { color: colors.error[500], bg: colors.error[100], label: 'Overdue' },
};

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoiceNumber,
  amount,
  dueDate,
  status,
  tenant,
  property,
  onPress,
  style,
}) => {
  const theme = useDesignSystemTheme();
  const statusInfo = statusConfig[status];

  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.invoiceNumber, { color: theme.colors.neutral[900] }]}>
            #{invoiceNumber}
          </Text>
          {tenant && (
            <Text style={[styles.tenant, { color: theme.colors.neutral[500] }]}>{tenant}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View>
          <Text style={[styles.amount, { color: theme.colors.neutral[900] }]}>
            ${amount.toLocaleString()}
          </Text>
          {property && (
            <Text style={[styles.property, { color: theme.colors.neutral[400] }]}>{property}</Text>
          )}
        </View>
        <Text style={[styles.dueDate, { color: theme.colors.neutral[500] }]}>Due: {dueDate}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  invoiceNumber: {
    fontSize: 15,
    fontWeight: '600',
  },
  tenant: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  property: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  dueDate: {
    fontSize: 12,
  },
});
