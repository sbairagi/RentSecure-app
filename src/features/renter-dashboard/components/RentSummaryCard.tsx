import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { RenterRentRecord } from '../../types/renterDashboard';

interface RentSummaryCardProps {
  rent: RenterRentRecord;
}

export function RentSummaryCard({ rent }: RentSummaryCardProps) {
  const theme = useTheme();

  const amount = parseFloat(rent.amount || '0');
  const lateFee = parseFloat(rent.late_fee || '0');
  const totalDue = amount + lateFee;

  const statusColor = rent.payment_status === 'paid'
    ? theme.colors.primary
    : rent.payment_status === 'overdue'
      ? theme.colors.error
      : theme.colors.tertiary;

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
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}>
        Current Rent
      </Text>

      <View style={styles.amountRow}>
        <View style={styles.amountBlock}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Rent Amount
          </Text>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            ₹{amount.toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={styles.amountBlock}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Due Date
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
            {new Date(rent.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>

      {lateFee > 0 && (
        <View style={styles.row}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Late Fee
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.error, fontWeight: '600' }}>
            ₹{lateFee.toLocaleString('en-IN')}
          </Text>
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

      <View style={styles.row}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          Total Due
        </Text>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
          ₹{totalDue.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusColor}15` },
          ]}
        >
          <Text variant="bodySmall" style={{ color: statusColor, fontWeight: '600' }}>
            {rent.payment_status.toUpperCase()}
          </Text>
        </View>
        {rent.payment_method && (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {rent.payment_method.replace('_', ' ').toUpperCase()}
          </Text>
        )}
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
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountBlock: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
});