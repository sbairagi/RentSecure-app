import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MAINTENANCE_CONSTANTS } from '../constants';
import type { MaintenanceExpense } from '../types';

interface MaintenanceExpenseCardProps {
  expense: MaintenanceExpense;
}

export const MaintenanceExpenseCard: React.FC<MaintenanceExpenseCardProps> = ({ expense }) => {
  const theme = useTheme();
  const paymentStatusConfig = MAINTENANCE_CONSTANTS.PAYMENT_STATUS_CONFIG[expense.payment_status as keyof typeof MAINTENANCE_CONSTANTS.PAYMENT_STATUS_CONFIG] || MAINTENANCE_CONSTANTS.PAYMENT_STATUS_CONFIG.pending;

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.description, { color: theme.text }]}>{expense.description}</Text>
        <View style={[styles.paymentBadge, { backgroundColor: paymentStatusConfig.backgroundColor }]}>
          <Text style={[styles.paymentText, { color: paymentStatusConfig.color }]}>
            {paymentStatusConfig.label}
          </Text>
        </View>
      </View>
      <View style={styles.costsContainer}>
        {expense.estimated_cost && (
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Estimated</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>₹{expense.estimated_cost}</Text>
          </View>
        )}
        {expense.actual_cost && (
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Actual</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>₹{expense.actual_cost}</Text>
          </View>
        )}
        {expense.vendor_cost && (
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Vendor</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>₹{expense.vendor_cost}</Text>
          </View>
        )}
        {expense.material_cost && (
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Material</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>₹{expense.material_cost}</Text>
          </View>
        )}
        {expense.labour_cost && (
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Labour</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>₹{expense.labour_cost}</Text>
          </View>
        )}
        {expense.additional_charges && Number(expense.additional_charges) > 0 && (
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Additional</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>₹{expense.additional_charges}</Text>
          </View>
        )}
      </View>
      <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
        <Text style={[styles.totalValue, { color: theme.primary }]}>₹{expense.total_cost}</Text>
      </View>
      {expense.receipt && (
        <Text style={[styles.receipt, { color: theme.primary }]}>📎 Receipt attached</Text>
      )}
      <Text style={[styles.date, { color: theme.textSecondary }]}>
        {new Date(expense.created_at).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  costsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  receipt: {
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
});
